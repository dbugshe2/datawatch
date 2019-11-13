/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {ScrollView, NativeModules, View, Alert} from 'react-native';
import {
  Text,
  ButtonGroup,
  Card,
  Input,
  Button,
  withTheme,
  ListItem,
  Divider,
  Badge,
} from 'react-native-elements';
import Evilicon from 'react-native-vector-icons/EvilIcons';
import {AppContext} from '../../context/AppContext';
import ViewPager from '@react-native-community/viewpager';
import ProgressCircle from 'react-native-progress-circle';
import styles from './styles';
class DataPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileIndex: 1,
    };
  }

  render() {
    const theme = this.props.theme;
    const endOfTest = () => {
      this.viewPager.setPage(0);
    };
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <ViewPager
              initialPage={0}
              scrollEnabled={true}
              keyboardDismissMode="on-drag"
              style={{flex: 1}}
              ref={viewPager => {
                this.viewPager = viewPager;
              }}>
              <View key="0" style={styles.container}>
                <Card title="Input Current Data Plan">
                  <ButtonGroup
                    onPress={index => context.updateNetworkIndex(index)}
                    selectedIndex={context.selectedNetworkIndex}
                    buttons={context.networkOptions}
                    containerStyle={{height: 40, marginVertical: 15}}
                  />

                  <Input
                    placeholder="Data Balance"
                    leftIcon={
                      <Evilicon name="close" size={25} color="#1565C0" />
                    }
                    label="Data Balance (MB):"
                    keyboardType="numeric"
                    containerStyle={{marginVertical: 15}}
                    onChangeText={text =>
                      context.handleDPDataBalanceChange(text)
                    }
                    returnKeyType="done"
                  />
                  <Button title="Check Data Balance" type="outline" />
                </Card>
                <Button
                  title="Done"
                  iconRight
                  buttonStyle={{
                    backgroundColor: theme.colors.success,
                    borderRadius: 0,
                    padding: 10,
                  }}
                  icon={<Evilicon name="arrow-right" size={32} color="white" />}
                  onPress={() => this.viewPager.setPage(1)}
                />
              </View>
              <View key="1" style={styles.container}>
                <Card title="Download a Test File">
                  <ButtonGroup
                    onPress={index => context.updateDownloadFileIndex(index)}
                    selectedIndex={context.downloadFileIndex}
                    buttons={context.downloadFileOptions}
                    containerStyle={{height: 40, marginVertical: 15}}
                  />
                  <Button
                    title="Start Download"
                    buttonStyle={{
                      padding: 10,
                      margin: 12,
                      backgroundColor: theme.colors.success,
                    }}
                  />
                </Card>
                <Button
                  title="Done"
                  iconRight
                  buttonStyle={{
                    backgroundColor: theme.colors.success,
                    borderRadius: 0,
                    padding: 10,
                  }}
                  icon={<Evilicon name="arrow-right" size={32} color="white" />}
                  onPress={() => this.viewPager.setPage(2)}
                />
              </View>
              <View key="2" style={styles.container}>
                <Card
                  title="Download in progress"
                  containerStyle={{
                    marginVertical: 10,
                  }}
                  wrapperStyle={{
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}>
                  <ProgressCircle
                    percent={60}
                    radius={100}
                    borderWidth={9}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff">
                    <Text style={{fontSize: 22}}>{'60% complete'}</Text>
                  </ProgressCircle>
                </Card>
                <Button
                  title="Done"
                  iconRight
                  buttonStyle={{
                    backgroundColor: theme.colors.success,
                    borderRadius: 0,
                    padding: 10,
                  }}
                  onPress={() => this.viewPager.setPage(3)}
                  icon={<Evilicon name="arrow-right" size={32} color="white" />}
                />
              </View>
              <View key="3" style={styles.container}>
                <Card title="Input Data Balance Again">
                  <Input
                    placeholder="Data Balance"
                    leftIcon={
                      <Evilicon name="close" size={25} color="#1565C0" />
                    }
                    label="Data Balance (MB):"
                    keyboardType="numeric"
                    containerStyle={{marginVertical: 15}}
                    onChangeText={text =>
                      context.updateDataUsageFinalBalance(text)
                    }
                    returnKeyType="done"
                  />
                  <Button title="Check Data Balance" type="outline" />
                </Card>
                <Button
                  title="Done"
                  iconRight
                  buttonStyle={{
                    backgroundColor: theme.colors.success,
                    borderRadius: 0,
                    padding: 10,
                  }}
                  onPress={() => this.viewPager.setPage(4)}
                  icon={<Evilicon name="arrow-right" size={32} color="white" />}
                />
              </View>
              <View key="4" style={styles.container}>
                <Card
                  title="Usage Comparison"
                  containerStyle={{borderColor: theme.colors.success}}
                  wrapperStyle={{
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'stretch',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Card title="from Device">
                      <Text h3>3 MB</Text>
                    </Card>
                    <Card title="from Carrier">
                      <Text h3>4 MB</Text>
                    </Card>
                  </View>
                  <Card>
                    <Text h3>28.6% Diffrence</Text>
                    <Badge value={'1 MB Difference'} status="warning" />
                  </Card>
                </Card>
                <Button title="Start over" onPress={() => endOfTest()} />
              </View>
            </ViewPager>
          );
          /* console.log('context is', context); */
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DataPlan);
