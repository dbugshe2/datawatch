import React from 'react';

import {SafeAreaView, StyleSheet, ScrollView, View} from 'react-native';
// import Ionicon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from 'react-native';
import {getBrand, getCarrier, getTotalMemory} from 'react-native-device-info';
import {Card, Text} from 'react-native-elements';

class DeviceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: '',
      carrier: '',
      ram: '',
      ipaddress: '',
      loading: true,
    };
  }
  getAllDeviceInfo = async () => {
    await Promise.all([getBrand(), getCarrier(), getTotalMemory()])
      .then(result => {
        this.setState({
          brand: result[0],
          carrier: result[1],
          ram: result[2],
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

  componentDidMount() {
    this.getAllDeviceInfo();
  }
  render() {
    const {loading} = this.state;
    return (
      <>
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            {loading ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <View>
                <Card>
                  <Text>Band: </Text>
                  <Text>{this.state.brand}</Text>
                </Card>
                <Card>
                  <Text>Carrier: </Text>
                  <Text>{this.state.carrier}</Text>
                </Card>
                <Card>
                  <Text>IP Address: </Text>
                  <Text>{this.state.ipaddress}</Text>
                </Card>
                <Card>
                  <Text>RAM: </Text>
                  <Text>{this.state.ram}</Text>
                </Card>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </>
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
