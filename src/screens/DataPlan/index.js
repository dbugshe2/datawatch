import React from 'react';

import {ScrollView, NativeModules, View} from 'react-native';
import {
  Text,
  ButtonGroup,
  Card,
  Input,
  Button,
  withTheme,
} from 'react-native-elements';
import Evilicon from 'react-native-vector-icons/EvilIcons';

const DataPlan = props => {
  const cycleButtons = [
    {
      element: () => <Text style={{fontSize: 20}}>1 Month</Text>,
    },
    {
      element: () => <Text style={{fontSize: 20}}>1 Week</Text>,
    },
    {
      element: () => <Text style={{fontSize: 20}}>1 Day</Text>,
    },
  ];
  const {theme} = props;
  return (
    <>
      <ScrollView>
        <Card title="Data Cycle">
          <ButtonGroup
            onPress={null}
            selectedIndex={0}
            buttons={cycleButtons}
            containerStyle={{height: 60}}
          />
        </Card>
        <Card title="Date Settings">
          <Input
            placeholder="Start Date"
            leftIcon={
              <Evilicon
                name="calendar"
                size={25}
                color={theme.colors.primary}
              />
            }
            label="Start Date"
          />
          <Input
            placeholder="End Date"
            leftIcon={
              <Evilicon
                name="calendar"
                size={25}
                color={theme.colors.primary}
              />
            }
            label="End Date"
          />
        </Card>
        <Card title="Data Usage">
          <Input
            placeholder="Available Data"
            leftIcon={
              <Evilicon name="chart" size={25} color={theme.colors.primary} />
            }
            label="Available Data"
          />
          <Input
            placeholder="Used Data"
            leftIcon={
              <Evilicon name="close" size={25} color={theme.colors.primary} />
            }
            label="Used Data"
          />
        </Card>
        <Button title="Save Changes" buttonStyle={{padding: 20, margin: 12}} />
      </ScrollView>
    </>
  );
};

export default withTheme(DataPlan);
