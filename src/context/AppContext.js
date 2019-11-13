/* eslint-disable react-native/no-inline-styles */
import React, {Component, createContext} from 'react';

import {
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  NativeModules,
  Alert,
} from 'react-native';
import {bytesToGB, bytesToMB} from '../common/utility';
import AsyncStorage from '@react-native-community/async-storage';

const STORAGE_KEY = '@DW_GLOBAL_STATE_ALPHA_0';
export const AppContext = createContext(); // creating the context for general app info
export default class AppContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionsGranted: false,
      dataUsageTestStart: null,
      dataUsageTestEnd: null,
      dataUsageTotalVolume: 0,
      dataUsageInitialBalance: 0,
      dataUsageFinalBalance: 0,
      selectedNetworkIndex: 0,
      downloadFileIndex: 1,
      downloadFileOptions: ['3MB', '10MB', '20MB'],
      networkOptions: ['Airtel', 'GLO', 'MTN', '9Mobile'],
      checkBalCodes: [
        {id: 0, carrier: 'airtel', code: '*140#'},
        {id: 1, carrier: 'glo', code: '*127*0#'},
        {id: 2, carrier: 'mtn', code: '*559#'},
        {id: 3, carrier: '9mobile', code: '*228#'},
      ],
      // ? device usage related state (Home Screen)
      deviceUsageStartTime: new Date(),
      deviceUsageCycleOptions: ['1 Month', '1 Week', '1 Day'],
      deviceUsageCycleIndex: 2, // updating
      appsUsage: [
        {
          name: '',
          tx: 0,
          rx: 0,
          txMb: '',
          rxMb: '',
          icon: '',
          total: '',
        },
      ],
      deviceUsageReady: false,
      deviceTotalUsage: 0.0,
    };
  }
  // TODO Use moment in this date
  updateDataUsageTestStart() {
    this.setState({dataUsageTestStart: new Date().now().getTime()});
  }
  // TODO Use moment in this date
  updateDataUsageTestEnd() {
    this.setState({dataUsageTestEnd: new Date().now().getTime()});
  }
  updateDataUsageTotalVolume() {
    const totalVolume =
      this.state.dataUsageFinalBalance - this.state.dataUsageInitialBalance;
    this.setState({dataUsageTotalVolume: totalVolume});
  }
  updateDataUsageInitialBalance(volume) {
    this.setState({dataUsageInitialBalance: volume});
  }
  updateDataUsageFinalBalance(volume) {
    this.setState({dataUsageFinalBalance: volume});
  }
  updateDownloadFileIndex = selectedIndex => {
    this.setState({downloadFileIndex: selectedIndex});
  };
  // ? index of selected netwrok used in check data balance
  updateNetworkIndex = selectedIndex => {
    this.setState({selectedNetworkIndex: selectedIndex});
  };
  // ? usage period used to display data usage on home screen
  updateUsageCycleIndex = selectedIndex => {
    this.setState({deviceUsageCycleIndex: selectedIndex});
  };
  updateAppsUsage() {
    this.setState({usageReady: false});
    // if (NativeModules.DataUsageModule) {
    // Get data usage of all installed apps in current device
    // Parameters "startDate" and "endDate" are optional (works only with Android 6.0 or later). Declare empty object {} for no date filter.
    NativeModules.DataUsageModule.listDataUsageByApps(
      {
        startDate: new Date(2019, 11, 3, 0, 0, 0, 0).getTime(), // 1495422000000 = Mon May 22 2017 00:00:00
        endDate: new Date().getTime(),
      },
      (err, jsonArrayStr) => {
        if (!err) {
          var apps = JSON.parse(jsonArrayStr);
          this.setState({
            appsUsage: apps,
            usageReady: true,
          });
        } else {
          console.error(err);
        }
      },
    );
    // } // end of data usage
  }

  updateDeviceTotalUsage = () => {
    let totalUsage = this.state.appsUsage
      .map(app => {
        return app.total;
      })
      .reduce((acc, appTotalBytes) => {
        return acc + appTotalBytes;
      }, 0);
    return bytesToMB(totalUsage);
  };

  retrieveAppState = async () => {
    try {
      let appState = await AsyncStorage.getItem(STORAGE_KEY);
      if (appState !== null) {
        let parsedAppState = JSON.parse(appState);
        this.setState({...parsedAppState});
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

  // ? Request for all permissions
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

  // ? Did Mount
  async componentDidMount() {
    this.retrieveAppState();
    // this.retrieveDP();

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
                  onPress: () => this.requestAppPermissions(),
                },
              ],
              {cancelable: false},
            );
          }
        },
      );
    }
  }

  // ? Did Update
  async componentDidUpdate() {
    this.saveAppState({...this.state});
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          updateDataUsageTestStart: this.updateDataUsageTestStart,
          updateDataUsageTestEnd: this.updateDataUsageTestEnd,
          updateDataUsageTotalVolume: this.updateDataUsageTotalVolume,
          updateDataUsageInitialBalance: this.updateDataUsageInitialBalance,
          updateDataUsageFinalBalance: this.updateDataUsageFinalBalance,
          updateDownloadFileIndex: this.updateDownloadFileIndex,
          updateNetworkIndex: this.updateNetworkIndex,
          updateUsageCycleIndex: this.updateUsageCycleIndex,
          updateAppsUsage: this.updateAppsUsage,
          updateDeviceTotalUsage: this.updateDeviceTotalUsage,
        }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
