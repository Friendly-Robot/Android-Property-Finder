'use strict';
 
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  BackAndroid
} from 'react-native';

export default class SearchResults extends Component {
 
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings)
    };
  }

  componentDidMount() {
  	BackAndroid.addEventListener('hardwareBackPress', () => {
	    if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
	        this.props.navigator.pop();
	        return true;
	    }
	    return false
	  });
	};

	componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
          this.props.navigator.pop();
          return true;
      }
      return false;
    });	
	}

  rowPressed(listerURL) {
  	var property = this.props.listings.filter(prop => prop.lister_url === listerURL)[0];
  	console.log('SEARCH RESULT PROPS', this.props.navigator);
		this.props.navigator.push({
		  title: 'Property View',
		  passProps: {property: property}
		});
	}
 
	renderRow(rowData, sectionID, rowID) {
	  var price = rowData.price_formatted.split(' ')[0];
	 
	  return (
	    <TouchableHighlight onPress={() => this.rowPressed(rowData.lister_url)}
	        underlayColor='#dddddd'>
	      <View>
	        <View style={styles.rowContainer}>
	          <Image style={styles.thumb} source={{ uri: rowData.img_url }} />
	          <View  style={styles.textContainer}>
	            <Text style={styles.price}>{price}</Text>
	            <Text style={styles.title}
	                  numberOfLines={1}>{rowData.title}</Text>
	          </View>
	        </View>
	        <View style={styles.separator}/>
	      </View>
	    </TouchableHighlight>
	  );
	}
 
  render() {
  	console.log('Search Result Render')
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}>
        <Text style={styles.title}> Results </Text>
      </ListView>
    );
  }
 
}

var styles = StyleSheet.create({
	pageHeader: {
		backgroundColor: 'green',
		fontSize: 20,
		alignSelf: 'stretch',
		height: 32
	},
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }	
})