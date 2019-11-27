/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {View, Alert} from 'react-native';
import {Button, withTheme, Overlay, Text} from 'react-native-elements';
import Evilicon from 'react-native-vector-icons/EvilIcons';
import {AppContext} from '../../context/AppContext';
import ViewPager from '@react-native-community/viewpager';
import StepIndicator from 'react-native-step-indicator';
// import downloadManager from 'react-native-simple-download-manager';

import styles from './styles';
import DataBalance from '../../components/DataBalance';
import DownloadSelect from '../../components/DownloadSelect';
import Download from '../../components/Download';
import UsageComparison from '../../components/UsageComparison';
class DataPlan extends React.Component {
  // static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      errorMessage: '',
    };
    this.onStepPress = this.onStepPress.bind(this);
  }
  onStepPress = page => {
    this.setState({currentPage: page});
    this.viewPager.setPage(page);
  };

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState.currentPage !== this.state.currentPage) {
      if (this.viewPager) {
        this.viewPager.setPage(nextState.currentPage);
      }
    }
  }
  render() {
    const theme = this.props.theme;
    return (
      <AppContext.Consumer>
        {context => {
          console.log('context is:', context);
          return (
            <View style={{flex: 1}}>
              <Overlay
                isVisible={context.connectionType !== 'cellular'}
              >
                <Text>This is an Overlay</Text>
            </Overlay>
              <View>
                <StepIndicator
                  stepCount={5}
                  currentPosition={this.state.currentPage}
                  labels={[
                    'Balance',
                    'Select Download',
                    'Download',
                    'Balance',
                    'Result',
                  ]}
                  onPress={null}
                  style={{padding: 10}}
                />
              </View>
              <ViewPager
                style={{flexGrow: 1}}
                initialPage={0}
                scrollEnabled={false}
                horizontalScroll={false}
                keyboardDismissMode="on-drag"
                ref={viewPager => {
                  this.viewPager = viewPager;
                }}>
                <View key="0" style={styles.container}>
                  <DataBalance initial errMess={this.state.errorMessage} />
                  <Button
                    title="Done"
                    iconRight
                    buttonStyle={{
                      backgroundColor: theme.colors.success,
                      borderRadius: 0,
                      padding: 10,
                    }}
                    icon={
                      <Evilicon name="arrow-right" size={32} color="white" />
                    }
                    onPress={() => {
                      if (context.dataUsageInitialBalance === 0) {
                        this.setState({
                          errorMessage: 'Please enter data balance',
                        });
                      } else {
                        this.setState({
                          errorMessage: '',
                        });
                        this.onStepPress(1);
                      }
                    }}
                  />
                </View>
                <View key="1" style={styles.container}>
                  <DownloadSelect />
                  <Button
                    disabled={context.isDownloadClicked}
                    title="Start Download"
                    iconRight
                    buttonStyle={{
                      backgroundColor: theme.colors.success,
                      borderRadius: 0,
                      padding: 10,
                    }}
                    icon={
                      <Evilicon name="arrow-right" size={32} color="white" />
                    }
                    onPress={() => {
                      this.onStepPress(2);
                      context.handleDownloadFile();
                    }}
                  />
                </View>
                <View key="2" style={styles.container}>
                  <Download />
                  <Button
                    disabled={
                      !context.isDownloadComplete && !context.isDownloadStopped
                    }
                    title="Done"
                    iconRight
                    buttonStyle={{
                      backgroundColor: theme.colors.success,
                      borderRadius: 0,
                      padding: 10,
                    }}
                    onPress={() => {
                      requestAnimationFrame(() => {
                        this.onStepPress(3);
                      });
                    }}
                    icon={
                      <Evilicon name="arrow-right" size={32} color="white" />
                    }
                  />
                </View>
                <View key="3" style={styles.container}>
                  <DataBalance errMess={this.state.errorMessage} />
                  <Button
                    title="Done"
                    iconRight
                    buttonStyle={{
                      backgroundColor: theme.colors.success,
                      borderRadius: 0,
                      padding: 10,
                    }}
                    onPress={() => {
                      if (context.dataUsageFinalBalance === 0) {
                        this.setState({
                          errorMessage: 'Please enter data balance again',
                        });
                      } else {
                        requestAnimationFrame(() => {
                          context.handleUsageComparison();
                          this.onStepPress(4);
                        });
                      }
                    }}
                    icon={
                      <Evilicon name="arrow-right" size={32} color="white" />
                    }
                  />
                </View>
                <View key="4" style={styles.container}>
                  <UsageComparison />
                  <Button
                    buttonStyle={{
                      padding: 10,
                      borderRadius: 0,
                      margin: 10,
                    }}
                    title="Start over"
                    iconRight
                    raised
                    icon={<Evilicon name="check" size={32} color="white" />}
                    onPress={() => {
                      requestAnimationFrame(() => {
                        context.handleStartOver();
                        this.onStepPress(0);
                      });
                    }}
                  />
                </View>
              </ViewPager>
            </View>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DataPlan);
