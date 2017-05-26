/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View} from 'react-native';
import MapOutdoor from './src/MapOutdoor';

export default class indoormap extends Component {
  render() {
    return (
		<MapOutdoor />
    );
  }
}

AppRegistry.registerComponent('indoormap', () => indoormap);
