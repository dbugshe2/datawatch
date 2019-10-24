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
import AppContextProvider, {AppContext} from './src/context/AppContext';
import {ThemeProvider} from 'react-native-elements';

class App extends React.Component {
  static contextType = AppContext;
  constructor() {
    super();
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
    // {permissionsGranted, requestAppPermisions} = this.context;
  }
  // !permissionsGranted ? requestAppPermisions() : null;
  render() {
    return (
      // <AppContextProvider>
      <ThemeProvider>
        <Navigator />
      </ThemeProvider>
      // </AppContextProvider>
    );
  }
}

export default App;
