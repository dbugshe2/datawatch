import React from 'react';
import {StyleSheet} from 'react-native';
import Dimensions from 'Dimensions';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
});

export default styles;
