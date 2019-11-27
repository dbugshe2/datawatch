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
import {
  Text,
  Card,
  Button,
  Divider,
  ListItem,
  withTheme,
  ButtonGroup,
} from 'react-native-elements';
import {bytesToMB} from '../../common/utility';
import * as Sentry from '@sentry/react-native';
import moment from 'moment';
class DataManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ? device usage related state (Home Screen)
      usageStartTime: new moment().valueOf(),
      usageEndTime: new moment().valueOf(),
      usageCycleOptions: ['1 Month', '1 Week', '1 Day'],
      currentCycleIndex: 2,
      usageCycleValues: ['M', 'w', 'd'],
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
      usageReady: false,
      totalUsage: 0.0,
    };
  }

  updateUsageStartTime = () => {
    try {
      this.setState({
        usageStartTime: new moment(this.state.usageEndTime)
          .subtract(
            1,
            this.state.usageCycleValues[this.state.currentCycleIndex],
          )
          .valueOf(),
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  updateUsageEndTime = () => {
    this.setState({usageEndTime: new moment().valueOf()});
  };

  updateAppsUsage = () => {
    if (this.state.totalUsage <= 0) {
      this.setState({usageReady: false});
    }

    if (NativeModules.DataUsageModule) {
      NativeModules.DataUsageModule.listDataUsageByApps(
        {
          startDate: this.state.usageStartTime,
          endDate: this.state.usageEndTime,
        },
        (err, jsonArrayStr) => {
          if (!err) {
            var apps = JSON.parse(jsonArrayStr);
            if (Array.isArray(apps) && apps != null && apps.length) {
              const total = apps
                .map(app => {
                  return app.total;
                })
                .reduce((acc, appTotalBytes) => {
                  return acc + appTotalBytes;
                }, 0);
              this.setState({
                appsUsage: apps,
                totalUsage: total,
                usageReady: true,
              });
            }
          } else {
            Sentry.captureException(err);
            this.setState({usageReady: true});
          }
        },
      );
    }
    // } // end of data usage
  };

  // ? usage period used to display data usage on home screen
  updateCycleIndex = selectedIndex => {
    this.setState({currentCycleIndex: selectedIndex});
  };

  handleUsageCycleChange = index => {
    requestAnimationFrame(() => {
      this.updateCycleIndex(index);
      this.updateUsageStartTime();
      this.updateAppsUsage();
    });
  };
  componentDidMount() {
    this.updateUsageStartTime();
    this.updateAppsUsage();
  }
  render() {
    // this app relies on netguard to restrict the internet connection of other appps
    const url =
      'https://play.google.com/store/apps/details?id=eu.faircode.netguard';
    const theme = this.props.theme;
    return (
      <ScrollView>
        <Card title="Device Data Usage" containerStyle={{margin: 5}}>
          <ButtonGroup
            onPress={index => this.handleUsageCycleChange(index)}
            selectedIndex={this.state.currentCycleIndex}
            buttons={this.state.usageCycleOptions}
            containerStyle={{height: 40}}
          />
          <View
            style={{
              marginBottom: 8,
              paddingHorizontal: 10,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            {this.state.usageReady ? (
              <Text h1 h1Style={{fontSize: 60, color: '#1565C0'}}>
                {bytesToMB(this.state.totalUsage)}
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
          <View style={{marginVertical: 10, padding: 10}}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 20,
                marginBottom: 5,
              }}>
              Showing Usage
            </Text>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 20,
                color: theme.colors.success,
              }}>
              from:
              {new moment(this.state.usageStartTime).format('Do MMMM YYYY')}
            </Text>
            <Text
              style={{
                fontWeight: '500',
                fontSize: 20,
                marginBottom: 5,
                color: theme.colors.error,
              }}>
              to: {new moment(this.state.usageEndTime).format('Do MMMM YYYY')}
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
                            } else {
                              return Linking.openURL(url);
                            }
                          })
                          .catch(err => Sentry.captureException(err));
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
                                console.log('startAppByPackageName started');
                              })
                              .catch(error => Sentry.captureException(error));
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
                              .catch(err => Sentry.captureException(err));
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
                this.state.usageReady
                  ? `recieved: ${app.rxMb} sent: ${app.txMb}`
                  : 'Loading...'
              }
              bottomDivider
            />
          ))}
        </Card>
      </ScrollView>
    );
  }
}

export default withTheme(DataManager);
