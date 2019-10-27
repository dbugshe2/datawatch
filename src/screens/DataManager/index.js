/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {ScrollView, View, NativeModules, Linking} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  Text,
  Card,
  Button,
  Divider,
  Avatar,
  ListItem,
} from 'react-native-elements';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryContainer,
} from 'victory-native';
const DataManager = () => {
  const apps = [
    {
      appName: 'this awesome app',
      usage: 34,
      icon: {title: 'app'},
    },
    {
      appName: 'this awesome app',
      usage: 34,
      icon: () => {
        <Avatar title="app" />;
      },
    },
    {
      appName: 'this awesome app',
      usage: 34,
      icon: () => {
        <Avatar title="app" />;
      },
    },
    {
      appName: 'this awesome app',
      usage: 34,
      icon: () => {
        <Avatar title="app" />;
      },
    },
  ];
  const data = [
    {quarter: 1, earnings: 13000},
    {quarter: 2, earnings: 16500},
    {quarter: 3, earnings: 14250},
    {quarter: 4, earnings: 19000},
    ,
  ];

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
  const url = 'http://www.netguard.me/';
  return (
    <ScrollView>
      <Card containerStyle={{margin: 5}}>
        <View
          style={{
            marginBottom: 15,
            paddingHorizontal: 25,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text h1 h1Style={{fontSize: 80, color: '#1565C0'}}>
              132
            </Text>
            <View style={{flexDirection: 'column'}}>
              <Text h1> MB </Text>
              <Text h2> Left</Text>
            </View>
          </View>
        </View>
        <View style={{marginBottom: 10, padding: 25}}>
          <Text h4 style={{marginBottom: 5}}>
            Total Plan: 500 MB
          </Text>
          <Text h4>Data Used: 500 MB</Text>
        </View>
        <Button
          title="Restrict Internet Access"
          type="outline"
          raised
          onPress={() => {
            Linking.canOpenURL(url)
              .then(supported => {
                if (!supported) {
                  console.log("Can't handle url: " + url);
                } else {
                  return Linking.openURL(url);
                }
              })
              .catch(err => console.error('An error occurred', err));
          }}
        />
      </Card>
      <Divider style={{marginTop: 15, marginHorizontal: 5}} />
      <Card wrapperStyle={{justifyContent: 'center', height: 300}}>
        <VictoryPie
          containerComponent={<VictoryContainer responsive />}
          theme={VictoryTheme.grayscale}
          data={[
            {x: '', y: 40},
            {x: '', y: 60},
            {x: '', y: 60},
            {x: '', y: 60},
            {x: '', y: 60},
          ]}
          labels={() => {
            null;
          }}
        />
      </Card>

      <Divider style={{marginTop: 15, marginHorizontal: 5}} />
      <View>
        {apps.map((item, index) => (
          <ListItem
            key={index}
            leftAvatar={{title: 'MD'}}
            title={item.appName}
            subtitle={`${item.usage} MB`}
            bottomDivider
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default DataManager;
