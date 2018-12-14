import React from 'react';

import { StatusBar, StyleSheet, View } from 'react-native';

import { Constants } from 'expo'

// app colors
import Color from './app/color.json'

// app navigation
import MainNavigation from './app/router'

// hides status bar
StatusBar.setHidden(true)

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MainNavigation />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
    paddingTop: Constants.statusBarHeight
  }
});
