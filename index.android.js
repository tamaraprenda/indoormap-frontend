/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import MapOutdoor from './src/MapOutdoor';
import MapIndoor from './src/MapIndoor';

export default class indoormap extends Component {
	render() {
		return (
			<Router hideNavBar= "true">
				<Scene key="root">
					<Scene key="mapOutdoor" component={MapOutdoor} initial={true} />
					<Scene key="mapIndoor" component={MapIndoor} />
				</Scene>
			</Router>
		);
	}
}

AppRegistry.registerComponent('indoormap', () => indoormap);
