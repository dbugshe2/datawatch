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
} from 'react-native-elements';
import {AppContext} from '../../context/AppContext';
import {bytesToGB} from '../../common/utility';
import DataPlan from '../DataPlan/index';

class DataManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appsUsage: [{name: '', tx: 0, rx: 0, txMb: '', rxMb: '', icon: ''}],
      usageReady: false,
      totalUsage: 0.0,
    };
  }
  componentDidMount() {
    if (NativeModules.DataUsageModule) {
      // Get data usage of all installed apps in current device
      // Parameters "startDate" and "endDate" are optional (works only with Android 6.0 or later). Declare empty object {} for no date filter.
      NativeModules.DataUsageModule.listDataUsageByApps(
        {
          startDate: new Date(2019, 10, 22, 0, 0, 0, 0).getTime(), // 1495422000000 = Mon May 22 2017 00:00:00
          endDate: new Date().getTime(),
        },
        (err, jsonArrayStr) => {
          if (!err) {
            var apps = JSON.parse(jsonArrayStr);
            this.setState({
              appsUsage: apps,
              usageReady: true,
            });
          }
        },
      );
    } // end of data usage
  }
  getTotalUsage = () => {
    let totalUsage = this.state.appsUsage
      .map(app => {
        return app.total;
      })
      .reduce((acc, appTotalBytes) => {
        return acc + appTotalBytes;
      }, 0);
    return bytesToGB(totalUsage);
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
                <View
                  style={{
                    marginBottom: 8,
                    paddingHorizontal: 10,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignContent: 'flex-end',
                    }}>
                    {this.state.usageReady ? (
                      <Text h1 h1Style={{fontSize: 40, color: '#1565C0'}}>
                        {this.getTotalUsage()}
                      </Text>
                    ) : (
                      <ActivityIndicator
                        style={{marginRight: 40}}
                        size="large"
                        color="#0000ff"
                      />
                    )}
                    <View style={{flexDirection: 'column'}}>
                      <Text h2> GB </Text>
                      <Text h3> Left</Text>
                    </View>
                  </View>
                  <ProgressCircle
                    percent={40}
                    radius={50}
                    borderWidth={8}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff"
                    outerCircleStyle={{alignSelf: 'flex-end'}}>
                    <Text style={{fontSize: 18}}>{'30%\nLeft'}</Text>
                  </ProgressCircle>
                </View>
                <View style={{marginBottom: 10, padding: 20}}>
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 20,
                      color: theme.colors.primary,
                      marginBottom: 5,
                    }}>
                    Data Plan Total: 500 MB
                  </Text>
                  <Text
                    style={{
                      fontWeight: '400',
                      color: theme.colors.warning,
                      fontSize: 20,
                    }}>
                    Data Volume Used: 498 MB
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
              <Card
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
              <Card
                title="Usage Comparison"
                containerStyle={{borderColor: theme.colors.success}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'stretch',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Card title="from Device">
                    <Text h3>234 MB</Text>
                  </Card>
                  <Card title="from Carrier">
                    <Text h3>654 MB</Text>
                  </Card>
                </View>
                <Card>
                  <Text h2>45% Diffrence</Text>
                  <Badge value={'43 MB Difference'} status="warning" />
                </Card>
              </Card>
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
