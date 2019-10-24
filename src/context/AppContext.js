import React, {Component, createContext} from 'react';

import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';

export const AppContext = createContext(); // creating the context for general app info

export default class AppContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionsGranted: false,
      curTest: {}, // current test state
      device: {}, // device info
    };
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
        ).then(result => {
          if (
            result['android.permission.ACCESS_FINE_LOCATION'] &&
            result['android.permission.ACCESS_COARSE_LOCATION'] &&
            result['android.permission.ACCESS_NETWORK_STATE'] &&
            result['android.permission.CHANGE_NETWORK_STATE'] &&
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
      <AppContext.Provider
        value={{
          ...this.state,
          requestAppPermissions: this.requestAppPermissions,
        }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
