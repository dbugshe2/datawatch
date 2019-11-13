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
import {
  NativeModules,
  Alert,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
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
    // requestAppPermissions();
  }
  requestAppPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        return await PermissionsAndroid.requestMultiple(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
          PermissionsAndroid.PERMISSIONS.CHANGE_NETWORK_STATE,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        ).then(result => {
          if (
            result['android.permission.ACCESS_FINE_LOCATION'] &&
            result['android.permission.ACCESS_COARSE_LOCATION'] &&
            result['android.permission.ACCESS_NETWORK_STATE'] &&
            result['android.permission.CHANGE_NETWORK_STATE'] &&
            result['android.permission.CALL_PHONE'] &&
            result['android.permission.READ_PHONE_STATE'] === 'granted'
          ) {
            console.log('read phone permission granted');
            this.setState({
              permissionsGranted: true,
            });
          } else if (
            result['android.permission.ACCESS_FINE_LOCATION'] ||
            result['android.permission.ACCESS_COARSE_LOCATION'] ||
            result['android.permission.ACCESS_NETWORK_STATE'] ||
            result['android.permission.CHANGE_NETWORK_STATE'] ||
            result['android.permission.CALL_PHONE'] ||
            result['android.permission.READ_PHONE_STATE'] === 'never_ask_again'
          ) {
            ToastAndroid.showWithGravity(
              'Please Go into Settings -> Apps -> datawatch -> Permissions and Allow permissions to continue',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
            console.log('some permissions denied, requesting permission....');
          }
        });
      } catch (err) {
        console.error(err); // TODO: remove in prod
      }
    }
  };
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
