/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View} from 'react-native';
import {Icon} from 'react-native-vector-icons/Ionicons';

function getImageSource(icon){
	Icon.getImageSource(icon, 30).then((source) => return source);
}