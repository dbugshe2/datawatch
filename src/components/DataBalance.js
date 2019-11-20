/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View} from 'react-native';
import {
  Button,
  Card,
  ButtonGroup,
  Input,
  withTheme,
} from 'react-native-elements';
import Evilicon from 'react-native-vector-icons/EvilIcons';
import {AppContext} from '../context/AppContext';

export class DataBalance extends Component {
  render() {
    const theme = this.props.theme;
    const {initial} = this.props;
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <View>
              <Card title="Input Current Data Plan">
                <ButtonGroup
                  onPress={index => context.updateNetworkIndex(index)}
                  selectedIndex={context.selectedNetworkIndex}
                  buttons={context.networkOptions}
                  containerStyle={{height: 40, marginVertical: 15}}
                />

                <Input
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
                />
                <Button
                  title="Check Data Balance"
                  type="outline"
                  onPress={() => context.handleCheckBal()}
                />
              </Card>
              {/* <Button
                title="Done"
                iconRight
                buttonStyle={{
                  backgroundColor: theme.colors.success,
                  borderRadius: 0,
                  padding: 10,
                }}
                icon={<Evilicon name="arrow-right" size={32} color="white" />}
                onPress={() => this.onStepPress(1)}
              /> */}
            </View>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DataBalance);
