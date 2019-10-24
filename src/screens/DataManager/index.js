import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Header} from 'react-native-elements';

const DataManager = () => {
  // if (NativeModules.DataUsageModule) {
  //   // Get data usage of all installed apps in current device
  //   // Parameters "startDate" and "endDate" are optional (works only with Android 6.0 or later). Declare empty object {} for no date filter.
  //   NativeModules.DataUsageModule.listDataUsageByApps(
  //     {
  //       startDate: new Date(2017, 4, 22, 0, 0, 0, 0).getTime(), // 1495422000000 = Mon May 22 2017 00:00:00
  //       endDate: new Date().getTime(),
  //     },
  //     (err, jsonArrayStr) => {
  //       if (!err) {
  //         var apps = JSON.parse(jsonArrayStr);
  //         console.log(apps);
  //         for (var i = 0; i < apps.length; i++) {
  //           var app = apps[i];
  //           console.log(
  //             'App name: ' +
  //               app.name +
  //               '\n' +
  //               'Package name: ' +
  //               app.packageName +
  //               '\n' +
  //               'Received bytes: ' +
  //               app.rx +
  //               'bytes\n' +
  //               'Transmitted bytes: ' +
  //               app.tx +
  //               'bytes\n' +
  //               'Received MB: ' +
  //               app.rxMb +
  //               '\n' +
  //               'Transmitted MB: ' +
  //               app.txMb,
  //           );
  //         }
  //       }
  //     },
  //   );

  //   // Get data usage of specific list of installed apps in current device
  //   // Example: get data usage for Facebook, YouTube and WhatsApp.
  //   // Parameters "startDate" and "endDate" are optional (works only with Android 6.0 or later)
  //   NativeModules.DataUsageModule.getDataUsageByApp(
  //     {
  //       packages: [
  //         'com.facebook.katana',
  //         'com.google.android.youtube',
  //         'com.whatsapp',
  //       ],
  //       startDate: new Date(2017, 4, 22, 0, 0, 0, 0).getTime(), // 1495422000000 = Mon May 22 2017 00:00:00
  //       endDate: new Date().getTime(),
  //     },
  //     (err, jsonArrayStr) => {
  //       if (!err) {
  //         var apps = JSON.parse(jsonArrayStr);
  //         console.log(apps);
  //         for (var i = 0; i < apps.length; i++) {
  //           var app = apps[i];
  //           console.log(
  //             'App name: ' +
  //               app.name +
  //               '\n' +
  //               'Package name: ' +
  //               app.packageName +
  //               '\n' +
  //               'Received bytes: ' +
  //               app.rx +
  //               'bytes\n' +
  //               'Transmitted bytes: ' +
  //               app.tx +
  //               'bytes\n' +
  //               'Received MB: ' +
  //               app.rxMb +
  //               '\n' +
  //               'Transmitted MB: ' +
  //               app.txMb,
  //           );
  //         }
  //       }
  //     },
  //   );

  //   // Check if app has permission to access data usage by apps
  //   // This way will not ask for permissions (check only)
  //   // If you pass "requestPermission": "true", then app will ask for permissions.
  //   NativeModules.DataUsageModule.requestPermissions(
  //     {requestPermission: 'false'},
  //     // eslint-disable-next-line handle-callback-err
  //     (err, result) => {
  //       var permissionObj = JSON.parse(result);
  //       if (!permissionObj.permissions) {
  //         Alert.alert(
  //           'Give Permission',
  //           'You need to enable data usage access for this app. Please, enable it on the next screen.',
  //           [
  //             // {text: 'Cancel', style: 'cancel', onPress: () => Actions.pop()},
  //             {
  //               text: 'Give permission',
  //               onPress: () => this.requestPermissions(),
  //             },
  //           ],
  //           {cancelable: false},
  //         );
  //       }
  //     },
  //   );
  // }
  return <Text>THis is th edata management page</Text>;
};

export default DataManager;
