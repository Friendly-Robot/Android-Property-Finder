'use strict';
 
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';
import SearchResults from './SearchResults';

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;
 
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');
 
  return 'http://api.nestoria.co.uk/api?' + querystring;
};

export default class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchString: 'London',
			isLoading: false,
			message: ''
		};
	}

	onSearchTextChanged(event) {
		console.log('onSearchTextChanged');
		this.setState({ searchString: event.nativeEvent.text });
		console.log(this.state.searchString);
	}

	onLocationPressed() {
		navigator.geolocation.getCurrentPosition(
	    location => {
	      var search = location.coords.latitude + ',' + location.coords.longitude;
	      this.setState({ searchString: search });
	      var query = urlForQueryAndPage('centre_point', search, 1);
	      this._executeQuery(query);
	    },
	    error => {
	      this.setState({
	        message: 'There was a problem with obtaining your location: ' + error
	      });
	    }
	  );
	}

	_handleResponse(response) {
	  this.setState({ isLoading: false , message: '' });
	  if (response.application_response_code.substr(0, 1) === '1') {
	  	console.log('RESPONSE: ', response);
	    this.props.navigator.push({
			  title: 'Search Results',
			  passProps: {listings: response.listings}
			});
	  } else {
	    this.setState({ message: 'Location not recognized; please try again.'});
	  }
	}

	_executeQuery(query) {
	  console.log(query);
	  this.setState({ isLoading: true });
	  fetch(query)
		  .then(response => response.json())
		  .then(json => this._handleResponse(json.response))
		  .catch(error =>
		     this.setState({
		      isLoading: false,
		      message: 'Something bad happened ' + error
		   }));
	}

	onSearchPressed() {
		if (this.state.searchString[0] === '-' || typeof(this.state.searchString) === 'number') {
			var query = urlForQueryAndPage('centre_point', this.state.searchString, 1);
		} else {
	  	var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
	  }
	  this._executeQuery(query);
	}	

  render() {
  	var spinner = this.state.isLoading ?
		  ( <ActivityIndicator
		      size='large'/> ) :
		  ( <View/>);
  	console.log('SearchPage.render');
    return (
      <View style={styles.container}>
      	<Text style={styles.welcome}> Property Finder </Text>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>
        <View style={styles.flowRight}>
				  <TextInput
				    style={styles.searchInput}
				    underlineColorAndroid='rgba(0,0,0,0)'
				    value={this.state.searchString}
				    onChange={this.onSearchTextChanged.bind(this)}
				    placeholder='Search via name or postcode'/>
				  <TouchableHighlight style={styles.button}
				      underlayColor='#99d9f4'
				      onPress={this.onSearchPressed.bind(this)}>
				    <Text style={styles.buttonText}>Go</Text>
				  </TouchableHighlight>
				</View>
				<TouchableHighlight style={styles.button}
				    underlayColor='#99d9f4'>
				  <Text style={styles.buttonText} onPress={this.onLocationPressed.bind(this)}>Location</Text>
				</TouchableHighlight>
				<Image source={require('../../resources/house.png')} style={styles.image}/>
				{spinner}
				<Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center'
  },  
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
   welcome: {
    fontSize: 28,
    textAlign: 'center',
    backgroundColor: 'green',
    height: 60,
    width: 420,
    padding: 10,
   	marginTop: -30,
   	marginBottom: 130
  },
  flowRight: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  alignSelf: 'stretch'
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  flex: 1,
	  flexDirection: 'row',
	  maxHeight: 46,
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	},
	searchInput: {
	  height: 36,
	  padding: 4,
	  marginRight: 5,
	  marginBottom: 5,
	  flex: 4,
	  fontSize: 18,
	  borderWidth: 1,
	  borderColor: '#48BBEC',
	  borderRadius: 8,
	  color: '#48BBEC'
	},
	image: {
		marginTop: 40,
	  width: 217,
	  height: 138
	}
});
