import React, {Component} from 'react';
import {AppRegistry, Navigator, View} from 'react-native';

import App, {AppContainer} from './App';
// Import components or Navigators as neccessary
import BasicFlatList from './components/BasicFlatList'
import {name as appName} from './app.json';



AppRegistry.registerComponent(appName, () => App); // BasicFlatList
