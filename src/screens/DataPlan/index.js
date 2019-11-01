/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {ScrollView, NativeModules, View, Alert} from 'react-native';
import {
  Text,
  ButtonGroup,
  Card,
  Input,
  Button,
  withTheme,
  ListItem,
  Divider,
} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Evilicon from 'react-native-vector-icons/EvilIcons';
import {AppContext} from '../../context/AppContext';

class DataPlan extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const theme = this.props.theme;
    // const {dataPlan, updateCycleTimeIndex} = this.context;
    return (
      <AppContext.Consumer>
        {context => {
          {
            /* console.log('context is', context); */
          }
          return (
            <ScrollView>
              <Card title="Data Cycle">
                <ButtonGroup
                  onPress={index => context.updateCycleTimeIndex(index)}
                  selectedIndex={context.dataPlanSelectedCycleIndex}
                  buttons={context.dataPlanCycleTimeOptions}
                  containerStyle={{height: 40}}
                />
              </Card>
              <Card title="Date Plan Settings">
                <ButtonGroup
                  onPress={index => context.updateNetworkIndex(index)}
                  selectedIndex={context.dataPlanSelectedNetworkIndex}
                  buttons={context.dataPlanNetworkOptions}
                  containerStyle={{height: 40, marginVertical: 15}}
                />
                <Input
                  placeholder="Start Date"
                  leftIcon={
                    <Evilicon name="calendar" size={25} color="#1565C0" />
                  }
                  label="Start Date"
                  containerStyle={{marginVertical: 15}}
                />
                {/* total volume */}
                <Input
                  placeholder="Total Volume"
                  leftIcon={<Evilicon name="chart" size={25} color="#1565C0" />}
                  keyboardType="numeric"
                  label="Total Volume (MB):"
                  containerStyle={{marginVertical: 15}}
                  onChangeText={text => context.handleDPTotalVolumeChange(text)}
                  returnKeyType="next"
                />
                {/* data balance */}
                <Input
                  placeholder="Data Balance"
                  leftIcon={<Evilicon name="close" size={25} color="#1565C0" />}
                  label="Data Balance (MB):"
                  keyboardType="numeric"
                  containerStyle={{marginVertical: 15}}
                  onChangeText={text => context.handleDPDataBalanceChange(text)}
                  returnKeyType="done"
                />
                <Button title="Check Data Balance" type="solid" />
              </Card>
              <Button
                title="Save Changes"
                buttonStyle={{padding: 20, margin: 12}}
              />
            </ScrollView>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default DataPlan;
