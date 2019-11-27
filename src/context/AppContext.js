/* eslint-disable react-native/no-inline-styles */
import React, {Component, createContext} from 'react';
import {NativeModules, Alert, PermissionsAndroid, Platform} from 'react-native';
import {bytesToMB, mbToBytes} from '../common/utility';
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
      dataUsageTestStart: new moment().valueOf(),
      dataUsageTestEnd: new moment().valueOf(),
      dataUsageTotalVolume: 0,
      dataUsageInitialBalance: 0,
      dataUsageFinalBalance: 0,
      selectedNetworkIndex: 0,
      downloadProgress: 0,
      isDownloadClicked: false,
      isDownloadBegin: false,
      isDownloadComplete: false,
      isDownloadStopped: false,
      downloadFileIndex: 0,
      downloadFileOptions: ['5MB', '10MB', '20MB'],
      networkOptions: ['Airtel', 'GLO', 'MTN', '9Mobile'],
      dataUsageDiffVolume: 0,
      dataUsageDiffVolumePercent: 0,
      dataDeviceUsageTotal: 0,
      testResultReady: false,
      checkBalCodes: [
        {id: 0, carrier: 'airtel', code: '*140#'},
        {id: 1, carrier: 'glo', code: '*127*0#'},
        {id: 2, carrier: 'mtn', code: '*559#'},
        {id: 3, carrier: '9mobile', code: '*228#'},
      ],
      brand: null,
      ram: null,
      osVersion: null,
      isConnected: null,
      connectionType: null,
      carrier: null,
      cellularGen: null,
      internetReachable: null,
      ipaddress: null,
      loadingDeviceInfo: true,
      loadingNetInfo: true,
      availabilityTime: 0,
      isAvailable: true,
      loadingAvailability: true,
    };
  }
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
  // TODO Use moment in this date
  updateDataUsageTestStart = () => {
    this.setState({dataUsageTestStart: new moment().valueOf()});
  };
  // TODO Use moment in this date
  updateDataUsageTestEnd = () => {
    this.setState({dataUsageTestEnd: new moment().valueOf()});
  };
  checkBal = code => {
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
  //  ? Downoad handlers
  updateDownloadFileIndex = selectedIndex => {
    this.setState({downloadFileIndex: selectedIndex});
  };
  handleDownloadFile = async () => {
    const filesUrl = [
      'http://ipv4.download.thinkbroadband.com/5MB.zip',
      'http://ipv4.download.thinkbroadband.com/10MB.zip',
      'http://ipv4.download.thinkbroadband.com/20MB.zip',
    ];
    const selectedFile = filesUrl[this.state.downloadFileIndex];
    const downloadOptions = {
      fromUrl: selectedFile,
      toFile:
        RNFS.ExternalStorageDirectoryPath +
        `/datawatch/TestFile${Math.random() * 1000 || 0}.zip`,
      progressDivider: 4,
      begin: this.downloadbegin,
      progress: this.downloadProgress,
    };
    const dir = await RNFS.mkdir(
      RNFS.ExternalStorageDirectoryPath + '/datawatch/',
    );
    if (dir) {
      console.log('folder created ....');
    }
    this.updateDataUsageTestStart();
    console.log('test start logged....');
    const download = RNFS.downloadFile(downloadOptions);
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
  handleUsageComparison = () => {
    const operatorVolume = Math.abs(
      this.state.dataUsageFinalBalance - this.state.dataUsageInitialBalance,
    );
    NativeModules.DataUsageModule.getDataUsageByApp(
      {
        packages: ['com.datawatch'],
        startDate: this.state.dataUsageTestStart,
        endDate: this.state.dataUsageTestEnd,
      },
      (err, jsonArrayStr) => {
        if (!err) {
          const app = JSON.parse(jsonArrayStr);
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
        }
      },
    );
  };

  percentUsageDiff = (VUE, VOP) => {
    const VDelta = VUE - VOP;
    console.log('this is your VUE VOP', VUE, VOP);
    const VDeltaAbs = Math.abs(VDelta);
    const VMean = (VUE + VOP) / 2;
    const VDiff = VDeltaAbs / VMean;
    const VDiffPercent = VDiff * 100;
    this.setState({
      dataUsageDiffVolume: VDeltaAbs,
      dataUsageDiffVolumePercent: VDiffPercent,
    });
  };
  handleStartOver = () => {
    RNRestart.Restart();
  };
  updateDataUsageTotalVolume = () => {
    const totalVolume =
      this.state.dataUsageFinalBalance - this.state.dataUsageInitialBalance;
    this.setState({dataUsageTotalVolume: totalVolume});
  };
  updateDataUsageInitialBalance = volume => {
    this.setState({dataUsageInitialBalance: volume});
  };
  updateDataUsageFinalBalance = volume => {
    this.setState({dataUsageFinalBalance: volume});
  };

  // ? index of selected netwrok used in check data balance
  updateNetworkIndex = selectedIndex => {
    this.setState({selectedNetworkIndex: selectedIndex});
  };
  checkAvailability = () => {
    this.setState({loadingAvailability: true});
    const val = new moment().valueOf();
    console.log(val);
    const result = new moment(this.state.availabilityTime).isBefore(val);
    console.log('result of check avaulability was: ', result);
    this.setState({isAvailable: result, loadingAvailability: false});
  };
  setAvailability = async () => {
    try {
      this.setState({loadingAvailability: true});
      let availability = await AsyncStorage.getItem('@availabilitytime');
      if (availability !== null) {
        availability = JSON.parse(availability);
        this.setState({
          availabilityTime: availability.time,
          loadingAvailability: false,
        });
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };
  // ? Did Mount
  async componentDidMount() {
    //#region
    console.log('running mount context', {...this.state});
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
    // Other Permissions
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
    this.setAvailability();

    //#endregion
    // 1574846755471
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
          checkAvailability: this.checkAvailability,
        }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
