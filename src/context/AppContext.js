/* eslint-disable react-native/no-inline-styles */
import React, {Component, createContext} from 'react';
import {NativeModules, Alert} from 'react-native';
import {bytesToMB} from '../common/utility';
import AsyncStorage from '@react-native-community/async-storage';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import RNFS from 'react-native-fs';
import {format, number, subtract, divide, abs, multiply, mean} from 'mathjs';
import {mbToBytes} from '../common/utility';

const STORAGE_KEY = '@DW_GLOBAL_STATE_ALPHA_0';
export const AppContext = createContext(); // creating the context for general app info
let downloadId = -1;
export default class AppContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUsageTestStart: null,
      dataUsageTestEnd: null,
      dataUsageTotalVolume: 0,
      dataUsageInitialBalance: 0,
      dataUsageFinalBalance: 0,
      selectedNetworkIndex: 0,
      downloadProgress: 0,
      isDownloadClicked: false,
      isDownloadBegin: false,
      isDownloadComplete: false,
      downloadFileIndex: 1,
      downloadFileOptions: ['5MB', '10MB', '20MB'],
      networkOptions: ['Airtel', 'GLO', 'MTN', '9Mobile'],
      dataUsageDiffVolume: null,
      dataUsageDiffVolumePercent: null,
      dataDeviceUsageTotal: null,
      testResultReady: false,
      checkBalCodes: [
        {id: 0, carrier: 'airtel', code: '*140#'},
        {id: 1, carrier: 'glo', code: '*127*0#'},
        {id: 2, carrier: 'mtn', code: '*559#'},
        {id: 3, carrier: '9mobile', code: '*228#'},
      ],
    };
    this.updateDataUsageInitialBalance = this.updateDataUsageInitialBalance.bind(
      this,
    );
    this.updateDataUsageFinalBalance = this.updateDataUsageFinalBalance.bind(
      this,
    );
    // this.updateDataUsageTestEnd = this.updateDataUsageTestEnd(this);
    // this.updateDataUsageTestStart = this.updateDataUsageTestStart(this);
    this.downloadProgress = this.downloadProgress.bind(this);
    this.downloadbegin = this.downloadbegin.bind(this);
  }
  // TODO Use moment in this date
  updateDataUsageTestStart = () => {
    this.setState({dataUsageTestStart: new Date().getTime()});
  };
  // TODO Use moment in this date
  updateDataUsageTestEnd = () => {
    this.setState({dataUsageTestEnd: new Date().getTime()});
  };
  checkBal = code => {
    RNImmediatePhoneCall.immediatePhoneCall(code);
  };
  handleCheckBal = () => {
    const getNetwork = this.state.checkBalCodes.filter(balCode => {
      return balCode.id === this.state.selectedNetworkIndex;
    });
    console.log(getNetwork);
    if (getNetwork.length) {
      this.checkBal(getNetwork[0].code);
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
        this.setState({isDownloadComplete: true});
      })
      .catch(err => {
        console.error('shit went down in download >>>', err);
      });
  };
  downloadbegin = data => {
    try {
      this.setState({isDownloadBegin: true});
    } catch (err) {
      console.error('Error in DonloadBegun: ', err);
    }
  };
  downloadProgress = data => {
    try {
      const percentage = (100 * data.bytesWritten) / data.contentLength || 0;
      this.setState({downloadProgress: percentage});
    } catch (err) {
      console.error('Error in download progress: ', err);
    }
  };
  deleteDownload = () => {};
  cancelDownload = () => {
    if (downloadId !== -1) {
      RNFS.stopDownload(downloadId);
    } else {
      this.setState({output: 'There is no download to stop'});
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
          var app = JSON.parse(jsonArrayStr);
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
  // percentUsageDiff = (Vue, Vop) => {
  //   const VUE = number(Vue);
  //   const VOP = number(Vop);
  //   const VDelta = subtract(VUE, VOP);
  //   const VDeltaAbs = abs(VDelta);
  //   const VMean = mean(VUE, VOP);
  //   const VDiff = divide(VDeltaAbs, VMean);
  //   const VDiffPercent = multiply(VDiff, 100);
  //   const resultDiff = format(VDelta);
  //   const resultDiffPercent = format(VDiffPercent);
  //   return {resultDiffPercent, resultDiff};
  // };
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
    this.setState({
      dataUsageTestStart: null,
      dataUsageTestEnd: null,
      dataUsageTotalVolume: 0,
      dataUsageInitialBalance: 0,
      dataUsageFinalBalance: 0,
      selectedNetworkIndex: 0,
      downloadProgress: 0,
      isDownloadClicked: false,
      isDownloadBegin: false,
      isDonwloadComplete: false,
      downloadFileIndex: 1,
      downloadFileOptions: ['5MB', '10MB', '20MB'],
      networkOptions: ['Airtel', 'GLO', 'MTN', '9Mobile'],
      checkBalCodes: [
        {id: 0, carrier: 'airtel', code: '*140#'},
        {id: 1, carrier: 'glo', code: '*127*0#'},
        {id: 2, carrier: 'mtn', code: '*559#'},
        {id: 3, carrier: '9mobile', code: '*228#'},
      ],
      // ? device usage related state (Home Screen)
    });
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
  // ? Did Mount
  async componentDidMount() {
    // this.retrieveAppState();
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
    // this.saveAppState({...this.state});
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
