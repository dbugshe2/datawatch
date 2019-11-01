/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  getBrand,
  getSystemVersion,
  getTotalMemory,
} from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import {Card, Text, Icon} from 'react-native-elements';
import {bytesToGB} from '../../common/utility';
import AppContextProvider, {AppContext} from '../../context/AppContext';
import {Ionicon} from 'react-native-vector-icons/Ionicons';

class DeviceInfo extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      brand: null,
      ram: null,
      osVersion: null,
      isConnected: null,
      connectionType: null,
      carrier: null,
      cellularGen: null,
      internetReachable: null,
      ipaddress: null,
      loading: true,
    };
  }
  getAllDeviceInfo = async () => {
    await Promise.all([getBrand(), getTotalMemory(), getSystemVersion()])
      .then(result => {
        this.setState({
          brand: result[0],
          ram: result[1],
          osVersion: result[2],
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
        });
      });
  };
  getAllNetInfo = () => {
    this.setState({loading: true});
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
              loading: false,
            })
          : this.setState({
              connectionType: state.type,
              loading: false,
            });
      } else {
        this.setState({
          connectionType: 'unavailable',
          loading: false,
        });
      }
    });
  };
  componentDidMount() {
    this.getAllDeviceInfo();
    this.getAllNetInfo();
  }

  render() {
    const {loading} = this.state;
    return (
      <AppContextProvider>
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            {loading ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <View>
                {/* start row */}
                <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
                  <Card title="Network Status">
                    {this.state.isConnected ? (
                      <Text h4Style={{color: '#2E7D32'}} h4>
                        Connected
                      </Text>
                    ) : (
                      <Text h4Style={{color: '#D84315'}} h4>
                        Disconnected
                      </Text>
                    )}
                  </Card>
                  <Card title="Internet Status">
                    {this.state.internetReachable ? (
                      <Text h4Style={{color: '#2E7D32'}} h4>
                        Online
                      </Text>
                    ) : (
                      <Text h4Style={{color: '#D84315'}} h4>
                        Offline
                      </Text>
                    )}
                  </Card>
                </View>
                {/* // end row */}
                <Card>
                  <Text>Connection Type: </Text>
                  {this.state.connectionType ? (
                    <Text>{this.state.connectionType}</Text>
                  ) : (
                    <Text>Unavailable</Text>
                  )}
                </Card>
                <Card>
                  <Text>Carrier: </Text>
                  {this.state.carrier ? (
                    <Text>{this.state.carrier}</Text>
                  ) : (
                    <Text>Unavailable</Text>
                  )}
                </Card>
                <Card>
                  <Text>Generation: </Text>
                  {this.state.cellularGen ? (
                    <Text>{this.state.cellularGen}</Text>
                  ) : (
                    <Text>Unavailable</Text>
                  )}
                </Card>
                <Card>
                  <Text>Ip Address: </Text>
                  {this.state.ipaddress ? (
                    <Text>{this.state.ipaddress}</Text>
                  ) : (
                    <Text>Unavailable</Text>
                  )}
                </Card>
                <Card>
                  <Text>Brand: </Text>
                  {this.state.brand ? (
                    <Text>{this.state.brand}</Text>
                  ) : (
                    <Text>Unavailable</Text>
                  )}
                </Card>
                <Card>
                  <Text>OS: </Text>
                  {this.state.osVersion ? (
                    <Text>{this.state.osVersion}</Text>
                  ) : (
                    <Text>Unavailable</Text>
                  )}
                </Card>
                <Card>
                  <Text>RAM: </Text>
                  {this.state.ram ? (
                    <Text>{`${bytesToGB(this.state.ram)} GB`}</Text>
                  ) : (
                    <Text>Unavailable</Text>
                  )}
                </Card>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </AppContextProvider>
    );
  }
}

export default DeviceInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
