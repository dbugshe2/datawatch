/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  ScrollView,
  View,
  NativeModules,
  Linking,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
// eslint-disable-next-line no-unused-vars
import IntentLauncher, {IntentConstant} from 'react-native-intent-launcher';
import ProgressCircle from 'react-native-progress-circle';
import {
  Text,
  Card,
  Button,
  Divider,
  ListItem,
  withTheme,
  Badge,
  ButtonGroup,
} from 'react-native-elements';
import {AppContext} from '../../context/AppContext';
import {bytesToGB, bytesToMB} from '../../common/utility';

class DataManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ? device usage related state (Home Screen)
      deviceUsageStartTime: new Date().getTime(),
      deviceUsageEndTime: new Date().getTime(),
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
  // ? usage period used to display data usage on home screen
  updateUsageCycleIndex = selectedIndex => {
    this.setState({deviceUsageCycleIndex: selectedIndex});
  };

  updateAppsUsage = () => {
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
  };

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
  updateDeviceUsageEndTime = () => {
    // TODO write code to generate a time based on selected index
  };
  render() {
    // this app relies on netguard to restrict the internet connection of other appps
    const url =
      'https://play.google.com/store/apps/details?id=eu.faircode.netguard';
    const theme = this.props.theme;
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <ScrollView>
              <Card title="Device Data Usage" containerStyle={{margin: 5}}>
                <ButtonGroup
                  onPress={index => this.updateUsageCycleIndex(index)}
                  selectedIndex={this.state.deviceUsageCycleIndex}
                  buttons={this.state.deviceUsageCycleOptions}
                  containerStyle={{height: 40}}
                />
                <View
                  style={{
                    marginBottom: 8,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  {this.state.deviceUsageReady ? (
                    <Text h1 h1Style={{fontSize: 60, color: '#1565C0'}}>
                      {this.getTotalUsage()}
                      {/* 0.91 */}
                    </Text>
                  ) : (
                    <ActivityIndicator
                      style={{marginRight: 60}}
                      size="large"
                      color="#0000ff"
                    />
                  )}
                  <View style={{flexDirection: 'column'}}>
                    <Text h2> MB </Text>
                    <Text h3> Used</Text>
                  </View>
                </View>
                <View style={{marginVertical: 10, padding: 20}}>
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 20,
                      color: theme.colors.primary,
                      marginBottom: 5,
                    }}>
                    Start Date: {new Date().toDateString()}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '400',
                      color: theme.colors.warning,
                      fontSize: 20,
                    }}>
                    End Date: {new Date().toDateString()}
                  </Text>
                </View>
                <Button
                  title="Restrict Internet Access"
                  type="outline"
                  raised
                  onPress={Platform.select({
                    ios: () => {
                      // ? inform user they need netguard
                      Alert.alert(
                        'Opening a third party app',
                        'this app uses a third party app called NetGuard to restrict internet access, click OK to launch it',
                        [
                          {
                            text: 'Launch NetGuard',
                            onPress: () => {
                              Linking.canOpenURL(url)
                                .then(supported => {
                                  if (!supported) {
                                    console.log("Can't handle url: " + url);
                                  } else {
                                    return Linking.openURL(url);
                                  }
                                })
                                .catch(err =>
                                  console.error('An error occurred', err),
                                );
                            },
                          },
                        ],
                      );
                    },
                    android: () => {
                      // check if app is installed by package name
                      IntentLauncher.isAppInstalled('eu.faircode.netguard')
                        .then(result => {
                          console.log('isAppInstalled yes');
                          // ? inform user about using netguard
                          Alert.alert(
                            'Opening a third party app',
                            'this app uses a third party app called NetGuard to restrict internet access, click OK to launch it',
                            [
                              {
                                text: 'Launch NetGuard',
                                onPress: () => {
                                  IntentLauncher.startAppByPackageName(
                                    'eu.faircode.netguard',
                                  )
                                    .then(() => {
                                      console.log(
                                        'startAppByPackageName started',
                                      );
                                    })
                                    .catch(error =>
                                      console.warn(
                                        'startAppByPackageName: could not open',
                                        error,
                                      ),
                                    );
                                },
                              },
                            ],
                            {cancelable: true},
                          );
                        })
                        .catch(error => {
                          console.warn('isAppInstalled: no', error);
                          // ? inform user they need netguard
                          Alert.alert(
                            'Opening a third party app',
                            'this app uses a third party app called NetGuard to restrict internet access, click OK to launch it',
                            [
                              {
                                text: 'Launch NetGuard',
                                onPress: () => {
                                  Linking.canOpenURL(url)
                                    .then(supported => {
                                      if (!supported) {
                                        console.log("Can't handle url: " + url);
                                      } else {
                                        return Linking.openURL(url);
                                      }
                                    })
                                    .catch(err =>
                                      console.error('An error occurred', err),
                                    );
                                },
                              },
                            ],
                          );
                        });
                    },
                  })}
                />
              </Card>
              <Divider style={{marginTop: 15, marginHorizontal: 5}} />

              <Divider style={{marginTop: 15, marginHorizontal: 5}} />

              <Card title="Current Cycle Usage">
                {this.state.appsUsage.map((app, index) => (
                  <ListItem
                    key={index}
                    leftAvatar={{
                      source: {uri: `data:image/gif;base64,${app.icon}`},
                      placeholderStyle: {backgroundColor: 'transparent'},
                      overlayContainerStyle: {backgroundColor: 'transparent'},
                      rounded: false,
                    }}
                    title={this.state.usageReady ? app.name : 'Loading...'}
                    subtitle={
                      this.state.deviceusageReady
                        ? `recieved: ${app.rxMb} sent: ${app.txMb}`
                        : 'Loading...'
                    }
                    bottomDivider
                  />
                ))}
              </Card>
            </ScrollView>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DataManager);
