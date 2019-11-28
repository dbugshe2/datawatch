/* eslint-disable react-native/no-inline-styles */
import React, {Component, createContext} from 'react';
import {NativeModules, Alert, PermissionsAndroid, Platform} from 'react-native';
import {mbToBytes} from '../common/utility';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import moment from 'moment';
import * as Sentry from '@sentry/react-native';
import {
  getBrand,
  getSystemVersion,
  getTotalMemory,
} from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

const STORAGE_KEY = '@DW_GLOBAL_STATE_ALPHA_0';
export const AppContext = createContext(); // creating the context for general app info
let downloadId = -1;
export default class AppContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUsageTestStart: new moment().valueOf(), // ? test start time used to retrieve data usage from device
      dataUsageTestEnd: new moment().valueOf(), // ? test end time used to retrieve data usage from device
      dataUsageTotalVolume: 0, // ?  difference between data balance (finalbalance - initalbalance)
      dataUsageInitialBalance: 0, // ? initial data balance inputted by user
      dataUsageFinalBalance: 0, // ? final data balance inputted by user
      selectedNetworkIndex: 0, // ? index of the currently selectedd network (see array below)
      downloadProgress: 0, // ? download progress
      isDownloadClicked: false, // ? prevent clicking download multiple times
      isDownloadBegin: false, // ? indicate when download begins
      isDownloadComplete: false, // ? indicate when download is complete
      isDownloadStopped: false, // ? initial when download is stoped
      downloadFileIndex: 0, // ? index of selected dwonload file
      downloadFileOptions: ['5MB', '10MB', '20MB', '50MB'], // ? list of download file sizes
      networkOptions: ['Airtel', 'GLO', 'MTN', '9Mobile'], // ? list of networks available for balance checking
      dataUsageDiffVolume: 0, // ? difference between device usage and operator derived usage
      dataUsageDiffVolumePercent: 0, // ? difference as percentage
      dataDeviceUsageTotal: 0, // ? device internet usage retrieved based on test time interval(from test start - test end-inteval)
      testResultReady: false,
      checkBalCodes: [
        // ? code used to check for data balance for each available network
        {id: 0, carrier: 'airtel', code: '*140#'},
        {id: 1, carrier: 'glo', code: '*127*0#'},
        {id: 2, carrier: 'mtn', code: '*559#'},
        {id: 3, carrier: '9mobile', code: '*228#'},
      ],
      brand: null, // ? device brand (derived from OS)
      ram: null, // ? device total RAM (derived from OS)
      osVersion: null, // ? OS version (derived from OS)
      isConnected: null, // ? device network connection (derived from OS)
      connectionType: null, // ? device network connection type (derived from OS)
      carrier: null, // ? device network carrier (derived from OS)
      cellularGen: null, // ? device cellular generation (2g, 3g, 4g) (derived from OS)
      internetReachable: null, // ? indicate internet availability (derived from OS)
      ipaddress: null, // ? device IP Address (derived from OS)
      loadingDeviceInfo: true,
      loadingNetInfo: true,
    };
  }
  // ? this method request device info from the OS (lib. react-native-net-info)
  getAllDeviceInfo = async () => {
    await Promise.all([getBrand(), getTotalMemory(), getSystemVersion()])
      .then(result => {
        this.setState({
          brand: result[0],
          ram: result[1],
          osVersion: result[2],
          loadingDeviceInfo: false,
        });
      })
      .catch(err => {
        Sentry.captureException(err);
        this.setState({
          loadingDeviceInfo: false,
        });
      });
  };
  // ? this mehtod request information about the network
  getAllNetInfo = () => {
    this.setState({loadingNetInfo: true});
    return NetInfo.addEventListener(state => {
      if (state.type !== 'none' && state.type !== 'unknown') {
        // when there is a connection
        state.type === 'cellular' || state.type === 'wifi'
          ? this.setState({
              isConnected: state.isConnected,
              connectionType: state.type,
              carrier: state.details.carrier,
              cellularGen: state.details.cellularGeneration,
              internetReachable: state.isInternetReachable,
              ipaddress: state.details.ipAddress,
              loadingNetInfo: false,
            })
          : this.setState({
              connectionType: state.type,
              loadingNetInfo: false,
            });
      } else {
        this.setState({
          connectionType: 'unavailable',
          loadingNetInfo: false,
        });
      }
    });
  };
  // ? this mehtods updates the value of the test start time
  updateDataUsageTestStart = () => {
    this.setState({dataUsageTestStart: new moment().valueOf()});
  };
  // ? this mehtods updates the value of the test end time
  updateDataUsageTestEnd = () => {
    this.setState({dataUsageTestEnd: new moment().valueOf()});
  };
  checkBal = code => {
    // ? this mehtods updates automatically dials the code for the selected network
    RNImmediatePhoneCall.immediatePhoneCall(code);
  };
  handleCheckBal = () => {
    try {
      const getNetwork = this.state.checkBalCodes.filter(balCode => {
        return balCode.id === this.state.selectedNetworkIndex;
      });
      console.log(getNetwork);
      if (getNetwork.length) {
        this.checkBal(getNetwork[0].code);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };
  // ? this method updates the value of the selected file index
  updateDownloadFileIndex = selectedIndex => {
    this.setState({downloadFileIndex: selectedIndex});
  };
  handleDownloadFile = async () => {
    // ? this is the list of download file link provided by thinkbroadband.com
    const filesUrl = [
      'http://ipv4.download.thinkbroadband.com/5MB.zip',
      'http://ipv4.download.thinkbroadband.com/10MB.zip',
      'http://ipv4.download.thinkbroadband.com/20MB.zip',
      'http://ipv4.download.thinkbroadband.com/50MB.zip',
    ];
    const selectedFile = filesUrl[this.state.downloadFileIndex];
    const downloadOptions = {
      fromUrl: selectedFile,
      toFile:
        RNFS.ExternalStorageDirectoryPath +
        `/datawatch/TestFile${Math.random() * 1000 || 0}.zip`, // ? autogenerate the file name
      progressDivider: 4,
      begin: this.downloadbegin,
      progress: this.downloadProgress,
      readTimeout: 10000,
    };
    const dir = await RNFS.mkdir(
      RNFS.ExternalStorageDirectoryPath + '/datawatch/',
    );
    if (dir) {
      console.log('folder created ....');
    }
    this.updateDataUsageTestStart();
    console.log('test start logged....');
    const download = RNFS.downloadFile(downloadOptions); // ? this is th edownload mehtos(lib react-native-fs)
    downloadId = download.jobId;
    console.log('jobID is: ' + downloadId);
    download.promise
      .then(res => {
        downloadId = -1;
        this.updateDataUsageTestEnd();
        console.log(res);
        this.setState({isDownloadComplete: true});
      })
      .catch(err => {
        Sentry.captureException(err);
      });
  };
  downloadbegin = async data => {
    try {
      this.setState({isDownloadBegin: true, isAvailable: false});
      const availability = {
        time: new moment().add(28, 'hours').valueOf(),
      };
      await AsyncStorage.setItem(
        '@availabilityTime',
        JSON.stringify(availability),
      );
    } catch (err) {
      Sentry.captureException(err);
    }
  };
  downloadProgress = data => {
    try {
      console.log(data);
      const percentage = (100 * data.bytesWritten) / data.contentLength || 0;
      this.setState({downloadProgress: percentage});
    } catch (err) {
      Sentry.captureException(err);
    }
  };
  deleteDownload = () => {};
  // ? this function stops a current file download
  cancelDownload = () => {
    try {
      if (downloadId !== -1) {
        RNFS.stopDownload(downloadId);
        downloadId = -1;
        this.setState({isDownloadStopped: true});
      } else {
        Alert.alert('No Download Running');
      }
    } catch (error) {
      // Sentry.captureException(error);
    }
  };
  // ? this mehtods isused in the last step to calculate the value of the usage difference
  handleUsageComparison = () => {
    const operatorVolume = Math.abs(
      this.state.dataUsageFinalBalance - this.state.dataUsageInitialBalance,
    );
    NativeModules.DataUsageModule.getDataUsageByApp(
      // ? this request the datausage of the datawatch app within the test time interval
      {
        packages: ['com.datawatch'],
        startDate: this.state.dataUsageTestStart,
        endDate: this.state.dataUsageTestEnd,
      },
      (err, jsonArrayStr) => {
        if (!err) {
          const app = JSON.parse(jsonArrayStr);
          if (Array.isArray(app) && app != null && app.length) {
            console.log(app);
            const appTotal = app[0].total;
            console.log('bout to run diff()');
            this.percentUsageDiff(appTotal, mbToBytes(operatorVolume));
            console.log('just ran diff()');
            this.setState({
              dataUsageTotalVolume: operatorVolume,
              dataDeviceUsageTotal: appTotal,
              testResultReady: true,
            });
          } else {
            Sentry.captureException(err);
            this.setState({testResultReady: true});
          }
        }
      },
    );
  };
  // ? this method is used to calculate the percentage differecne of two values in Bytes
  // ? this is based on the mathematical model
  percentUsageDiff = (VUE, VOP) => {
    const VDelta = VUE - VOP;
    const VDeltaAbs = Math.abs(VDelta);
    const sumIt = VUE + VOP;
    const VMean = sumIt / 2;
    const VDiffPercent = (100 * VDeltaAbs) / VMean;
    this.setState({
      dataUsageDiffVolume: VDeltaAbs,
      dataUsageDiffVolumePercent: VDiffPercent,
    });
  };
  // ? this reatarts the application after a test to refresh the information
  handleStartOver = () => {
    RNRestart.Restart();
  };
  // ? this method calculate the difference between inital data ballance and final data balance
  updateDataUsageTotalVolume = () => {
    const totalVolume =
      this.state.dataUsageFinalBalance - this.state.dataUsageInitialBalance;
    this.setState({dataUsageTotalVolume: totalVolume});
  };
  // ? this method updates the value of initial data balance
  updateDataUsageInitialBalance = volume => {
    this.setState({dataUsageInitialBalance: volume});
  };
  // ? this methods updates the value of final data balance after download
  updateDataUsageFinalBalance = volume => {
    this.setState({dataUsageFinalBalance: volume});
  };

  // ? index of selected netwrok used in check data balance
  updateNetworkIndex = selectedIndex => {
    this.setState({selectedNetworkIndex: selectedIndex});
  };

  // ? Did Mount
  async componentDidMount() {
    //#region
    // ? this methods request permission to access device internet usage
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
    // ? requesting required Permissions from user
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }
    this.getAllDeviceInfo();
    this.getAllNetInfo();

    //#endregion
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
          handleCheckBal: this.handleCheckBal,
          handleDownloadFile: this.handleDownloadFile,
          cancelDownload: this.cancelDownload,
          deleteDownload: this.deleteDownload,
          handleStartOver: this.handleStartOver,
          handleUsageComparison: this.handleUsageComparison,
        }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
