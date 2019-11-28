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

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://15ef774899424f35ba3e142acd208947@sentry.io/1833934',
});

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
