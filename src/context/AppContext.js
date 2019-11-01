/* eslint-disable react-native/no-inline-styles */
import React, {Component, createContext} from 'react';

import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const DATA_PLAN_KEY = 'DW_DP_STATE';
const DEVICE_USAGE_KEY = 'DW_DU_STATE';
const STORAGE_KEY = '@DW_GLOBAL_STATE';
export const AppContext = createContext(); // creating the context for general app info
export default class AppContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionsGranted: false,
      dataPlanStartDate: null,
      dataPlanCycleTime: null,
      dataPlanTotalVolume: '', //updating
      dataPlanDataBalance: '', //updating
      dataPlanSelectedNetworkIndex: 0, //updating
      dataPlanNetworkOptions: ['Airtel', 'GLO', 'MTN', '9Mobile'],
      dataPlanSelectedCycleIndex: 0, // updating
      dataPlanCycleTimeOptions: ['1 Month', '1 Week', '1 Day'],
      DeviceUsage: {},
      checkBalCodes: [
        {carrier: 'airtel', code: '*140#'},
        {carrier: 'glo', code: '*127*0#'},
        {carrier: 'mtn', code: '*559#'},
        {carrier: '9mobile', code: '*228#'},
      ],
    };
  }

  updateCycleTimeIndex = selectedIndex => {
    this.setState({dataPlanSelectedCycleIndex: selectedIndex});
  };
  updateNetworkIndex = selectedIndex => {
    this.setState({dataPlanSelectedNetworkIndex: selectedIndex});
  };

  handleDPTotalVolumeChange = value => {
    console.log(value);
    this.setState({dataPlanTotalVolume: value});
  };
  handleDPDataBalanceChange = value => {
    console.log(value);
    this.setState({dataPlanDataBalance: value});
  };

  retrieveAppState = async () => {
    try {
      let appState = await AsyncStorage.getItem(STORAGE_KEY);
      if (appState !== null) {
        let parsedAppState = JSON.parse(appState);
        this.setState(parsedAppState);
      }
    } catch (error) {
      console.error('retrieveAppState faild: ', error);
    }
  };

  saveAppState = async data => {
    try {
      return await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  async componentDidMount() {
    this.retrieveAppState();
    // this.retrieveDP();
  }
  componentDidUpdate() {}
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
      <AppContext.Provider
        value={{
          ...this.state,
          requestAppPermissions: this.requestAppPermissions,
          saveAppState: this.saveAppState,
          updateCycleTimeIndex: this.updateCycleTimeIndex,
          updateNetworkIndex: this.updateNetworkIndex,
          handleDPTotalVolumeChange: this.handleDPTotalVolumeChange,
          handleDPDataBalanceChange: this.handleDPDataBalanceChange,
        }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
