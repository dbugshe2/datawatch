/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Card, withTheme} from 'react-native-elements';
// import Evilicon from 'react-native-vector-icons/EvilIcons';
import ProgressCircle from 'react-native-progress-circle';
import {AppContext} from '../context/AppContext';

export class Download extends Component {
  /*
  this component displays the progress of the current file download
  and provides a button to stop the download
  */

  render() {
    const theme = this.props.theme; // this is provided the lib. - react-native-elements
    return (
      <AppContext.Consumer>
        {context => {
          // context refers to the global state
          return (
            <Card
              title="Download in progress..."
              containerStyle={{margin: 0}}
              wrapperStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
              }}>
              <ProgressCircle
                percent={context.downloadProgress}
                radius={100}
                borderWidth={9}
                color="#3399FF"
                shadowColor="#999"
                bgColor="#fff">
                <Text
                  style={{
                    fontSize: 22,
                  }}>
                  {context.isDownloadComplete
                    ? 'Complete'
                    : `${parseFloat(context.downloadProgress).toFixed(0)} %`}
                </Text>
              </ProgressCircle>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Button
                  title="Stop Download"
                  onPress={() => context.cancelDownload()}
                  buttonStyle={{
                    backgroundColor: theme.colors.error,
                  }}
                  disabled={
                    context.isDownloadStopped || context.isDownloadComplete
                  }
                  constainerStyle={{
                    marginRight: 5,
                  }}
                />
              </View>
            </Card>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(Download);
