import React, {Component} from 'react';
import {AppRegistry} from 'react-native';

import App from './App';
import BasicFlatList from './components/BasicFlatList'
import {name as appName} from './app.json';



AppRegistry.registerComponent(appName, () => App); // BasicFlatList
