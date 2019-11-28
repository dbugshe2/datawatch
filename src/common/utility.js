// eslint-disable-next-line no-unused-vars
import * as React from 'react';

// ? convert Bytes to Megabytes - output a string with no decimals
export const bytesToMB = Bytes => {
  return parseFloat(Bytes / 1024 / 1024).toFixed(0); //
};

// ? convert Bytes to gigabytes - output a string with no decimals
export const bytesToGB = Bytes => {
  return parseFloat(Bytes / 1024 / 1024 / 1024).toFixed(0);
};

// ? convert Bytes to gigabytes
export const mbToBytes = MB => {
  return MB * 1024 * 1024;
};

/**
 *
 *  <Overlay
                borderRadius={8}
                isVisible={context.connectionType !== 'cellular'}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: theme.colors.error,
                      marginBottom: 10,
                    }}
                    h2>
                    Mobile Internet Disabled
                  </Text>
                  <Text style={{textAlign: 'center', marginBottom: 20}} h4>
                    This test is designed for mobile internet, please enable
                    your mobile data connection
                  </Text>
                  <Text style={{marginTop: 20}}>
                    This Message Will Disappear After Mobile Data is Enabled
                  </Text>
                </View>
              </Overlay>

 */
