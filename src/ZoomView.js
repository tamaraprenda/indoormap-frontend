import React, { Component } from 'react'
import { ScrollView, Image, TouchableHighlight} from 'react-native'
export default class ZoomView extends Component {
	
	constructor(props) {
        super(props);
		this.state = {
			imageWidth: 0,
			imageHeight: 0,
        }
    }
	
	componentWillMount(){
		Image.getSize(this.props.source.uri, (imageWidth, imageHeight) => {
			this.setState({
				imageWidth: imageWidth,
				imageHeight: imageHeight
			});
		});
	}
	
	static defaultProps = {
		doAnimateZoomReset: false,
		maximumZoomScale: 2,
		minimumZoomScale: 1,
	}
	handleResetZoomScale = (event) => {
		this.scrollResponderRef.scrollResponderZoomTo({ 
			x: 0, 
			y: 0, 
			width: this.props.zoomWidth, 
			height: this.props.zoomHeight, 
			animated: true 
		})
	}
	setZoomRef = node => {
		if (node) {
			this.zoomRef = node
			this.scrollResponderRef = this.zoomRef.getScrollResponder()
		}
	}
	render() {
		return (
			<ScrollView
				contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} //flexbox styles
				centerContent //centers content when zoom is less than scroll view bounds 
				maximumZoomScale={this.props.maximumZoomScale}
				minimumZoomScale={this.props.minimumZoomScale}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				refNode={this.setZoomRef}
				style={{ overflow: 'hidden' }}>
				<TouchableHighlight
					onPress={this.handleResetZoomScale}>
					<Image
						style={{width:this.state.imageWidth,height:this.state.imageHeight}}
						source={this.props.source} />
				</TouchableHighlight>
			</ScrollView>
		)
	}
}