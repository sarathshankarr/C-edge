// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {ColorProvider} from './src/components/colorTheme/colorTheme';

// Import your context provider

const AppWithProvider = () => (
  <ColorProvider>
    <App />
  </ColorProvider>
);

AppRegistry.registerComponent(appName, () => AppWithProvider);
