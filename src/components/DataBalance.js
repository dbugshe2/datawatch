/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View} from 'react-native';
import {
  Button,
  Card,
  ButtonGroup,
  Input,
  withTheme,
  Text,
} from 'react-native-elements';
import Evilicon from 'react-native-vector-icons/EvilIcons';
import {AppContext} from '../context/AppContext';

export class DataBalance extends Component {
  /*
  This component is used to check for data balance for a selected network
  and allows user to manually input the data balance in the device
  */

  render() {
    // this value indicates whether this is the initial data balance
    // or the data balance after the download
    const {initial} = this.props;
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <View>
              <Card title="Input Current Data Plan">
                <ButtonGroup
                  // used to select a prefered network
                  onPress={index => context.updateNetworkIndex(index)}
                  selectedIndex={context.selectedNetworkIndex}
                  buttons={context.networkOptions}
                  containerStyle={{height: 40, marginVertical: 15}}
                />

                <Input
                  // used to manually feed data balance value
                  placeholder="Data Balance"
                  leftIcon={<Evilicon name="close" size={25} color="#1565C0" />}
                  label="Data Balance (MB):"
                  keyboardType="numeric"
                  containerStyle={{marginVertical: 15}}
                  onChangeText={text =>
                    initial
                      ? context.updateDataUsageInitialBalance(text)
                      : context.updateDataUsageFinalBalance(text)
                  }
                  returnKeyType="done"
                  enablesReturnKeyAutomatically
                  errorMessage={this.props.errMess}
                />
                <Text>
                  Ensure data balance has been updated ( use smaller data plan )
                </Text>
                <Button
                  // used to check data usage balance for selected network
                  title="Check Data Balance"
                  type="outline"
                  onPress={() => context.handleCheckBal()}
                />
              </Card>
            </View>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DataBalance);
