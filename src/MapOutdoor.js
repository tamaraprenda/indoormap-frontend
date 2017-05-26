/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View,Dimensions,TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import {Container,Header,Item,Input,Button,Spinner,Toast,Icon,Fab} from 'native-base';

const { width, height } = Dimensions.get('window');
const ratio = width / height;
const delta = 0.00922;
let id = 1;
	
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
        }
		
		this.onRegionChange = this.onRegionChange.bind(this);
		this.onPress = this.onPress.bind(this);
		this.onPressLocate = this.onPressLocate.bind(this);
	}
	
	onRegionChange(region) {
		this.setState({region: region});
	}
	
	onPress(e) {
		/*
		Toast.show({
			text: JSON.stringify(e.nativeEvent.coordinate),
			position: 'bottom',
			buttonText: 'Okay'
		})
		*/
	}
	
	onPressLocate(e){
		navigator.geolocation.getCurrentPosition(
			(position) => {
				var region = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					latitudeDelta: delta,
					longitudeDelta: delta * ratio,
				}
				this.map.animateToRegion(region, 1);
				this.setState({position: position.coords});
			},
			(error) => {
			},
			{enableHighAccuracy: true, timeout: 2000, maximumAge: 1000}
		);
	}
	
	componentWillMount() {
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
                        <Icon name="navigate" />
                    </Item>
                    <Button transparent>
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
						<Fab
							position="bottomRight"
							onPress={this.onPressLocate}>
							<Icon name="locate"/>
						</Fab>
						<View
							style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.bubble}>
								<Text>Indoor map available in your position</Text>
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
		marginTop: 1.5,
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