import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native';

// app colors
import Color from '../color.json'

export default class Settings extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Configurações</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: Color.secondary
    }
});