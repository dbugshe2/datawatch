/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text} from 'react-native';
import {Card, ButtonGroup, withTheme} from 'react-native-elements';
import {AppContext} from '../context/AppContext';

export class DownloadSelect extends Component {
  // ? this component allows user to select a preferred download filesize
  render() {
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <Card title="Select a Test File Size">
              <ButtonGroup
                // ? used to select file size for file download
                onPress={index => context.updateDownloadFileIndex(index)}
                selectedIndex={context.downloadFileIndex}
                buttons={context.downloadFileOptions}
                containerStyle={{height: 40, marginVertical: 15}}
              />
              <Text>
                This is a smaple video file that will downloaded to your phone
              </Text>
            </Card>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DownloadSelect);
