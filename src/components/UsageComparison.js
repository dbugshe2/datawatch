/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {Button, Text, Card, Badge, withTheme} from 'react-native-elements';
import {AppContext} from '../context/AppContext';
import {bytesToMB} from '../common/utility';

export class UsageComparison extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <AppContext.Consumer>
        {context => {
          return (
            <Card
              title="Usage Comparison"
              containerStyle={{borderColor: theme.colors.success}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'stretch',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Card
                  title="from Device"
                  containerStyle={{margin: 0, flex: 1, alignItems: 'center'}}>
                  {context.testResultReady ? (
                    <Text h3>
                      {bytesToMB(context.dataDeviceUsageTotal)}
                      MB
                    </Text>
                  ) : (
                    <ActivityIndicator />
                  )}
                </Card>
                <Card
                  title="from Carrier"
                  containerStyle={{margin: 0, flex: 1, alignItems: 'center'}}>
                  <Text h3>{context.dataUsageTotalVolume} MB</Text>
                </Card>
              </View>
              <Card containerStyle={{margin: 0, alignItems: 'center'}}>
                {context.testResultReady ? (
                  <Text h3>
                    {parseFloat(context.dataUsageDiffVolumePercent).toFixed(0)}{' '}
                    % Difference
                  </Text>
                ) : (
                  <ActivityIndicator />
                )}
                {context.testResultReady ? (
                  <Badge
                    value={`${bytesToMB(
                      context.dataUsageDiffVolume,
                    )} MB Difference`}
                    status="warning"
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </Card>
            </Card>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default withTheme(UsageComparison);
