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
  Badge,
} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Evilicon from 'react-native-vector-icons/EvilIcons';
import {AppContext} from '../../context/AppContext';
import ProgressCircle from 'react-native-progress-circle';

class DataPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileIndex: 1,
    };
  }

  render() {
    const theme = this.props.theme;
    // const {dataPlan, updateCycleTimeIndex} = this.context;
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <ScrollView>
              <Card title="Input Current Data Plan">
                <ButtonGroup
                  onPress={index => context.updateNetworkIndex(index)}
                  selectedIndex={context.dataPlanSelectedNetworkIndex}
                  buttons={context.dataPlanNetworkOptions}
                  containerStyle={{height: 40, marginVertical: 15}}
                />

                <Input
                  placeholder="Data Balance"
                  leftIcon={<Evilicon name="close" size={25} color="#1565C0" />}
                  label="Data Balance (MB):"
                  keyboardType="numeric"
                  containerStyle={{marginVertical: 15}}
                  onChangeText={text => context.handleDPDataBalanceChange(text)}
                  returnKeyType="done"
                />
                <Button title="Check Data Balance" type="outline" />
              </Card>

              <Card title="Download a Test File">
                <ButtonGroup
                  onPress={index => this.setState({fileIndex: index})}
                  selectedIndex={1}
                  buttons={['1.5MB', '3MB', '10MB']}
                  containerStyle={{height: 40, marginVertical: 15}}
                />
                <Button
                  title="Start Download"
                  buttonStyle={{
                    padding: 10,
                    margin: 12,
                    backgroundColor: theme.colors.success,
                  }}
                />
              </Card>
              <Card
                title="Download in progress"
                containerStyle={{
                  marginVertical: 100,
                }}
                wrapperStyle={{
                  marginBottom: 200,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}>
                  <ProgressCircle
                    percent={60}
                    radius={100}
                    borderWidth={9}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff">
                    <Text style={{fontSize: 22}}>{'60% complete'}</Text>
                  </ProgressCircle>
                </View>
              </Card>
              <Card title="Input Data Balance Again">
                <ButtonGroup
                  onPress={index => context.updateNetworkIndex(index)}
                  selectedIndex={context.dataPlanSelectedNetworkIndex}
                  buttons={context.dataPlanNetworkOptions}
                  containerStyle={{height: 40, marginVertical: 15}}
                />

                <Input
                  placeholder="Data Balance"
                  leftIcon={<Evilicon name="close" size={25} color="#1565C0" />}
                  label="Data Balance (MB):"
                  keyboardType="numeric"
                  containerStyle={{marginVertical: 15}}
                  onChangeText={text => context.handleDPDataBalanceChange(text)}
                  returnKeyType="done"
                />
                <Button title="Check Data Balance" type="outline" />
              </Card>

              <Card
                title="Usage Comparison"
                containerStyle={{borderColor: theme.colors.success}}
                wrapperStyle={{
                  marginBottom: 200,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'stretch',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Card title="from Device">
                    <Text h3>3 MB</Text>
                  </Card>
                  <Card title="from Carrier">
                    <Text h3>4 MB</Text>
                  </Card>
                </View>
                <Card>
                  <Text h3>28.6% Diffrence</Text>
                  <Badge value={'1 MB Difference'} status="warning" />
                </Card>
              </Card>
            </ScrollView>
          );
          /* console.log('context is', context); */
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(DataPlan);
