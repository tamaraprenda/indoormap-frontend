/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,View,Image,Dimensions,ScrollView,TouchableOpacity,DeviceEventEmitter} from 'react-native';
import {Container,Header,Item,Input,Button,Spinner,Toast,Fab,Left} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Beacons from 'react-native-beacons-manager';

const { width, height } = Dimensions.get('window');
const ratio = width / height;
const delta = 0.01;

const GET_BEACONS = "http://5.135.160.204:8080/api/ibeacons/";
const GET_BUILDINGS = "http://5.135.160.204:8080/api/buildings/";
const GET_FLOORS = "http://5.135.160.204:8080/api/floors/";
const GET_ROOMS = "http://5.135.160.204:8080/api/rooms/";
export default class MapIndoor extends Component {
		
	constructor(props) {
        super(props);
		
		this.state = {
			loading:false,
			debug: "",
			imageWidth: 0,
			imageHeight: 0,
			offsetX: 0,
			offsetY: 0,
			floor: {
				image: 'http://5.135.160.204/VIII2.png'
			},
			rooms: [],
			position: {
				x: 0,
				y: 0,
			},
			
			searching: false,
			title: "No Indoor Map here",
            region: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: delta,
				longitudeDelta: delta * ratio,
			},
			markers: [],
			initialized: false,
			uuid: '',
			indoormap: {
				id: 6,
				found: false
			},
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
			Beacons.detectIBeacons();
			Beacons
				.startRangingBeaconsInRegion("itbindoormap1", this.props.uuid)
				.then(() => console.log('Beacons ranging started succesfully'))
				.catch(error => console.log(`Beacons ranging not started, error: ${error}`));
		}).done();
	}
	
	onStartMeasure(e){
		Toast.show({
			text: this.state.debug,
			position: 'bottom',
			buttonText: 'Okay'
		});
	}
	
	onBackToOutdoorMap(){
		setTimeout(() => {
			Actions.pop();
		},0);
	}
	
	render() {
		return (
			<Container>
				<Header style={{backgroundColor:'transparent'}}>
					<Left>
                        <Button transparent
							onPress={this.onBackToOutdoorMap} >
                            <Icon name='ios-arrow-dropleft' />
                        </Button>
                    </Left>
                </Header>
				<View style={{width:width, height:height}}>
					<ScrollView>
						<ScrollView
							horizontal={true}						
							maximumZoomScale={1}
							maximumZoomScale={3}
							zoomScale={2}>
							<TouchableOpacity
								activeOpacity={1}
								onLongPress={(e) => this.onStartMeasure(e)}>
								<Image
									style={mapStyle(this.state)}
									source={{uri: this.state.floor.image}}>
									<Icon
										style={{top:this.state.position.y, left:this.state.position.x}}
										name='ios-radio-button-on'
										size={30}
										color="blue" />
								</Image>
							</TouchableOpacity>
						</ScrollView>
					</ScrollView>
				</View>
			</Container>
		);
	}
	
	componentDidMount() {
		DeviceEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
				var beacons = [];
				for (i in data.beacons){
					if (data.beacons[i].major == this.props.id){
						beacons.push(data.beacons[i]);
					}
				}
				if (!this.state.loading){
					this.setState({loading:true});
					fetch(GET_FLOORS + this.props.id + "/rooms", {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(beacons)
					}).then((response) => {
						return response.json();
					}).then((data) => {
						if (data.length > 0){
							
							var ratio = this.state.floor.width / this.state.imageWidth;
							var position = data[0].position;
							this.setState({debug: JSON.stringify({
								x: position.x.toFixed(2),
								y: position.y.toFixed(2)
							})});
							position.x = position.x / ratio;
							position.y = position.y / ratio;
							this.setState({rooms: data});
							this.setState({position: position});
							
						}
					}).catch((error) => {
						this.setState({debug: error});
					}).done(() => {
						this.setState({loading:false});
					});
				}
            }
        );
	}
	
	componentWillUnmount() {
		Beacons
            .stopRangingBeaconsInRegion("itbindoormap1", this.props.uuid)
            .then(() => console.log('Beacons ranging stopped succesfully'))
            .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
        DeviceEventEmitter.removeListener('beaconsDidRange');
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