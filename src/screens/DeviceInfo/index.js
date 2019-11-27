/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import {Card, Text, Icon} from 'react-native-elements';
import {bytesToGB} from '../../common/utility';
import {AppContext} from '../../context/AppContext';

class DeviceInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  didBlurSubscription = this.props.navigation.addListener(
    'didBlur',
    payload => {
      console.log('idiblur beach');
    },
  );
  componentWillUnmount() {
    this.didBlurSubscription.remove();
  }

  render() {
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <SafeAreaView>
              <ScrollView contentInsetAdjustmentBehavior="automatic">
                {context.loadingDeviceInfo && context.loadingNetInfo ? (
                  <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : (
                  <View>
                    {/* start row */}
                    <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
                      <Card title="Network Status">
                        {context.isConnected ? (
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
                        {context.internetReachable ? (
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
                      {context.connectionType ? (
                        <Text>{context.connectionType}</Text>
                      ) : (
                        <Text>Unavailable</Text>
                      )}
                    </Card>
                    <Card>
                      <Text>Carrier: </Text>
                      {context.carrier ? (
                        <Text>{context.carrier}</Text>
                      ) : (
                        <Text>Unavailable</Text>
                      )}
                    </Card>
                    <Card>
                      <Text>Generation: </Text>
                      {context.cellularGen ? (
                        <Text>{context.cellularGen}</Text>
                      ) : (
                        <Text>Unavailable</Text>
                      )}
                    </Card>
                    <Card>
                      <Text>Ip Address: </Text>
                      {context.ipaddress ? (
                        <Text>{context.ipaddress}</Text>
                      ) : (
                        <Text>Unavailable</Text>
                      )}
                    </Card>
                    <Card>
                      <Text>Brand: </Text>
                      {context.brand ? (
                        <Text>{context.brand}</Text>
                      ) : (
                        <Text>Unavailable</Text>
                      )}
                    </Card>
                    <Card>
                      <Text>OS: </Text>
                      {context.osVersion ? (
                        <Text>{context.osVersion}</Text>
                      ) : (
                        <Text>Unavailable</Text>
                      )}
                    </Card>
                    <Card>
                      <Text>RAM: </Text>
                      {context.ram ? (
                        <Text>{`${bytesToGB(context.ram)} GB`}</Text>
                      ) : (
                        <Text>Unavailable</Text>
                      )}
                    </Card>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          );
        }}
      </AppContext.Consumer>
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
