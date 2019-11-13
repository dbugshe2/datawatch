/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import {YellowBox} from 'react-native';
import Navigator from './src/navigation/Navigator';
import {ThemeProvider} from 'react-native-elements';
import AppContextProvider from './src/context/AppContext';

class App extends React.Component {
  constructor() {
    super();
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
  }

  render() {
    return (
      <ThemeProvider>
        <AppContextProvider>
          <Navigator />
        </AppContextProvider>
      </ThemeProvider>
    );
  }
}

export default App;
