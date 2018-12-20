import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native';

// app locale
import AppLocale from '../AppLocale'

// app colors
import Color from '../color.json'

export default class Settings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            locale: null
        }

    }

    async componentDidMount() {

        // get locale object
        this.setState({
            locale: await AppLocale.translate()
        })

        // ever enter this component
        this.onEnterEvent = this.props.navigation.addListener('didFocus', () => {
        })

    }

    componentWillUnmount() {
        this.onEnterEvent.remove();
    }

    render() {

        // not loaded locale object yet
        if (!this.state.locale) return null

        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.state.locale.settings.text}</Text>
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