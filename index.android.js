/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';
import SearchPage from './android/modules/SearchPage';
import SearchResults from './android/modules/SearchResults';
import PropertyView from './android/modules/PropertyView';


export default class PropertyFinder extends Component {
  renderScene(route, navigator) {
    if (route.title === 'Property Finder') {
      return <SearchPage navigator={navigator} {...route.passProps} />
    }
    if (route.title === 'Search Results') {
      return <SearchResults navigator={navigator} {...route.passProps} />
    }
    if (route.title === 'Property View') {
      return <PropertyView navigator={navigator} {...route.passProps} />
    }
  }

  render() {
    return (

        <Navigator
            style={styles.container}
            initialRoute={{
            title: 'Property Finder',
            index: 0
            }}
            renderScene={ this.renderScene }
         />

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    color: 'black',
    fontSize: 30
  },
});

AppRegistry.registerComponent('PropertyFinder', () => PropertyFinder);
