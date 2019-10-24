import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import DataManager from '../screens/DataManager';
import DataPlan from '../screens/DataPlan';
import DeviceInfo from '../screens/DeviceInfo';
import Icon from 'react-native-vector-icons/AntDesign';

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
      title: 'Data Plan',
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
          <Icon name="home" size={25} color={tintColor} />;
        },
      },
    },
    Plan: {
      screen: DataPlanStack,
      navigationOptions: {
        tabBarLabel: 'Plan',
        tabBarIcon: ({tintColor}) => {
          <Icon name="wallet" size={25} color={tintColor} />;
        },
      },
    },
    Device: {
      screen: DeviceInfoStack,
      navigationOptions: {
        tabBarLabel: 'Device',
        tabBarIcon: ({tintColor}) => {
          <Icon name="mobile1" size={25} color={tintColor} />;
        },
      },
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default createAppContainer(App);
