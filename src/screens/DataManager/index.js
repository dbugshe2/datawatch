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
import DataPlan from '../DataPlan/index';

class DataManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appsUsage: [
        {
          name: '',
          tx: 0,
          rx: 0,
          txMb: '',
          rxMb: '',
          icon: '',
        },
      ],
      usageReady: false,
      // totalUsage: 0.0,
    };
  }
  componentDidMount() {
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
  getTotalUsage = () => {
    let totalUsage = this.state.appsUsage
      .map(app => {
        return app.total;
      })
      .reduce((acc, appTotalBytes) => {
        return acc + appTotalBytes;
      }, 0);
    return bytesToMB(totalUsage);
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
                  onPress={index => context.updateCycleTimeIndex(index)}
                  selectedIndex={context.dataPlanSelectedCycleIndex}
                  buttons={context.dataPlanCycleTimeOptions}
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
                    Start Date: {new Date().toLocaleDateString()}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '400',
                      color: theme.colors.warning,
                      fontSize: 20,
                    }}>
                    End Date: {new Date().toLocaleDateString()}
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
              {/* <Card
                title="Data Plan"
                containerStyle={{borderColor: theme.colors.primary}}>
                <ListItem
                  title="Total Volume(MB):"
                  rightTitle={context.dataPlanTotalVolume}
                  subtitle=""
                  bottomDivider
                />
                <ListItem
                  title="Data Balance(MB):"
                  subtitle=""
                  rightTitle={context.dataPlanDataBalance}
                  bottomDivider
                />
                <ListItem
                  title="Data Cycle:"
                  subtitle=""
                  rightTitile={context.dataPlanCycleTimeOptions}
                />
                <ListItem />
                <Button
                  title="Edit data Plan"
                  type="solid"
                  raised
                  onPress={() => this.props.navigation.navigate('Plan')}
                />
              </Card>
               */}

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
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DataManager);
