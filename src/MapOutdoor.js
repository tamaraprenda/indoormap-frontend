/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View,Dimensions,TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import {Container,Header,Item,Input,Button,Spinner,Toast,Icon,Fab} from 'native-base';
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');
const ratio = width / height;
const delta = 0.00922;
let id = 1;
const GET_BEACONS = "http://5.135.160.204:8080/api/ibeacons/";
const GET_BUILDINGS = "http://5.135.160.204:8080/api/buildings/";
const GET_FLOORS = "http://5.135.160.204:8080/api/floors/";
const GET_ROOMS = "http://5.135.160.204:8080/api/rooms/";

export default class MapOutdoor extends Component {
	
	watchID: ?number = null;
	
	constructor(props) {
        super(props);

        this.state = {
			title: "No Indoor Map here",
            region: {
				latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: delta,
				longitudeDelta: delta * ratio,
			},
			position: {
				latitude: 37.78825,
				longitude: -122.4324,
			},
			markers: [],
			initialized: false,
			ibeacon: ''
        }
		
		this.onRegionChange = this.onRegionChange.bind(this);
	}
	
	onRegionChange(region) {
		this.setState({region: region});
	}
	
	componentWillMount() {
		fetch(GET_BEACONS, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			}
		}).then((response) => {
			return response.json();
		}).then((data) => {
			if (data.length > 0)
				this.setState({ibeacon: data[0].uuid});
			Toast.show({
				text: data[0].uuid,
				position: 'bottom',
				buttonText: 'Okay'
			});
		}).done();
	}
	
	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({position: position.coords});
			},
			(error) => {
			},
			{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		);
		this.watchID = navigator.geolocation.watchPosition((position) => {
			if (!this.state.initialized){
				var region = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					latitudeDelta: delta,
					longitudeDelta: delta * ratio,
				}
				this.setState({region:region});
				this.setState({initialized:true});
			}
			this.setState({position: position.coords});
		});
	}
	
	search(e){
		
	}
	
	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchID);
	}
	
	render() {
		return (
			<Container>
				<Header searchBar rounded style={{backgroundColor:'transparent'}}>
                    <Item rounded>
                        <Icon name="search" />
                        <Input placeholder="Search" />
                    </Item>
                    <Button transparent onPress={(e) => this.search(e)}>
                        <Text>Search</Text>
                    </Button>
                </Header>
				{!this.state.initialized ? (
					<View style={styles.container}>
						<Loading />
					</View>
				) : (
					<View
						style={styles.container}>
						<MapView
							ref={ref => { this.map = ref; }}
							style={styles.map}
							showsUserLocation={true}
							region={this.state.region}
							onRegionChange={this.onRegionChange}>
							{this.state.markers.map(marker => (
								<MapView.Marker
									title={marker.title}
									key={marker.key}
									coordinate={marker.coordinate}
								/>
							))}
						</MapView>
						<View
							style={styles.buttonContainer}>
							<TouchableOpacity
								onPress={() => {
									Actions.mapIndoor({id: 4}); 
								}}
								style={styles.bubble}>
								<Text>Indoor map is available in your position</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</Container>
		);
	}
}

const Loading = () => (
	<View style={styles.container}>
		<Spinner />
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	containerBottom: {
		flex: 1,
		marginBottom: 0,
		alignItems: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	bubble: {
		backgroundColor: 'rgba(255,255,255,0.7)',
		paddingHorizontal: 18,
		paddingVertical: 12,
		borderRadius: 20,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginVertical: 20,
		backgroundColor: 'transparent',
	},
});