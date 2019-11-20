/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import {YellowBox, PermissionsAndroid, Platform} from 'react-native';
import Navigator from './src/navigation/Navigator';
import {ThemeProvider} from 'react-native-elements';
import AppContextProvider from './src/context/AppContext';

class App extends React.Component {
  constructor() {
    super();
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
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
