/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import {YellowBox} from 'react-native';
import Navigator from './src/navigation/Navigator';
import {ThemeProvider} from 'react-native-elements';
import {NativeModules, Alert} from 'react-native';
import AppContextProvider from './src/context/AppContext';

class App extends React.Component {
  constructor() {
    super();
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
    if (NativeModules.DataUsageModule) {
      // Check if app has permission to access data usage by apps
      // This way will not ask for permissions (check only)
      // If you pass "requestPermission": "true", then app will ask for permissions.
      NativeModules.DataUsageModule.requestPermissions(
        {requestPermission: 'true'},
        (err, result) => {
          if (err) {
            console.error('Data usage permission failed', err);
          }
          var permissionObj = JSON.parse(result);
          if (!permissionObj.permissions) {
            Alert.alert(
              'Give Permission',
              'You need to enable data usage access for this app. Please, enable it on the next screen.',
              [
                {
                  text: 'Give permission',
                  onPress: () => this.requestPermissions(),
                },
              ],
              {cancelable: false},
            );
          }
        },
      );
    }
  }
  render() {
    return (
      <ThemeProvider>
        <AppContextProvider>
          <Navigator />
        </AppContextProvider>
      </ThemeProvider>
    );
  }
}

export default App;
