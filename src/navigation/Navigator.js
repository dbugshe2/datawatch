import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import DataManager from '../screens/DataManager';
import DataPlan from '../screens/DataPlan';
import DeviceInfo from '../screens/DeviceInfo';
import Ionicon from 'react-native-vector-icons/Ionicons';

const DataManagerStack = createStackNavigator({
  DataManagerScreen: {
    screen: DataManager,
    navigationOptions: {
      title: 'Data Manager',
    },
  },
});
const DataPlanStack = createStackNavigator({
  DataPlanScreen: {
    screen: DataPlan,
    navigationOptions: {
      title: 'Set Data Plan',
    },
  },
});
const DeviceInfoStack = createStackNavigator({
  DeviceInfoScreen: {
    screen: DeviceInfo,
    navigationOptions: {
      title: 'Device info',
    },
  },
});

const App = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: DataManagerStack,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => {
          return <Ionicon name={'ios-home'} size={25} color={tintColor} />;
        },
      },
    },
    Plan: {
      screen: DataPlanStack,
      navigationOptions: {
        tabBarLabel: 'Plan',
        tabBarIcon: ({tintColor}) => {
          return <Ionicon name={'ios-wallet'} size={25} color={tintColor} />;
        },
      },
    },
    Device: {
      screen: DeviceInfoStack,
      navigationOptions: {
        tabBarLabel: 'Device',
        tabBarIcon: ({tintColor}) => {
          return (
            <Ionicon name={'ios-phone-portrait'} size={25} color={tintColor} />
          );
        },
      },
    },
  },
  {
    initialRouteName: 'Home',
    barStyle: {backgroundColor: '#1565C0'},
  },
);

export default createAppContainer(App);
