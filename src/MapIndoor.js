/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View,Image,Dimensions,ScrollView,TouchableOpacity} from 'react-native';
import {Toast} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const ratio = width / height;

const GET_BEACONS = "http://5.135.160.204:8080/api/ibeacons/";
const GET_BUILDINGS = "http://5.135.160.204:8080/api/buildings/";
const GET_FLOORS = "http://5.135.160.204:8080/api/floors/";
const GET_ROOMS = "http://5.135.160.204:8080/api/rooms/";
export default class MapIndoor extends Component {
		
	constructor(props) {
        super(props);
		this.state = {
			imageWidth: 0,
			imageHeight: 0,
			zoom: 1,
			offsetX: 0,
			offsetY: 0,
			positionX: 0,
			positionY: 0,
			floor: {
				image: 'http://5.135.160.204/VIII2.png'
			}
        }
    }
	
	componentWillMount(){
		fetch(GET_FLOORS + this.props.id, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			}
		}).then((response) => {
			return response.json();
		}).then((data) => {
			this.setState({floor: data});
			Image.getSize(data.image, (imageWidth, imageHeight) => {
				if (imageWidth > imageHeight){
					this.setState({
						imageWidth: imageWidth * (height / imageHeight), 
						imageHeight: height
					});
				}
				else{
					this.setState({
						imageWidth: width, 
						imageHeight: imageHeight * (width / imageWidth)
					});
				}
			});
		}).done();
	}
	
	zoomMap(e){
		this.setState({
			positionX:e.nativeEvent.locationX, 
			positionY:e.nativeEvent.locationY,
		});
		var ratio = this.state.floor.width / this.state.imageWidth;
		var x = e.nativeEvent.locationX * ratio;
		var y = e.nativeEvent.locationY * ratio;
		Toast.show({
			text: "<" + x + "," + y + ">",
			position: 'bottom',
			buttonText: 'Okay'
		});
	}
	
	render() {
		return (
			<View style={{width:width, height:height}}>
				<ScrollView>
					<ScrollView
						horizontal={true}						
						maximumZoomScale={1}
						maximumZoomScale={3}
						zoomScale={2}>
						<TouchableOpacity
							activeOpacity={1}
							onPress={(e) => this.zoomMap(e)}>
							<Image
								style={mapStyle(this.state)}
								source={{uri: this.state.floor.image}}>
								<Icon
									style={{top:this.state.positionY, left:this.state.positionX}}
									name='ios-man'
									size={30}
									color="blue" />
							</Image>
						</TouchableOpacity>
					</ScrollView>
				</ScrollView>
			</View>
		);
	}

}

mapStyle = function(state){
	return{
		top: state.offsetY,
		left: state.offsetX,
		width: state.imageWidth,
		height: state.imageHeight,
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});