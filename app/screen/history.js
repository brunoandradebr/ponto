import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native'

// app locale
import AppLocale from '../AppLocale'

// select component
import RNPickerSelect from 'react-native-picker-select'

// app colors
import Color from '../color.json'

export default class History extends Component {

    constructor(props) {
        super(props)

        this.state = {
            locale: null,
            year: 2018,
            years: [
                { label: '2018', value: 2018 }
            ],
            month: new Date().getMonth(),
            months: [
                { label: 'Janeiro', value: 0 },
                { label: 'Fevereiro', value: 1 },
                { label: 'Março', value: 2 },
                { label: 'Abril', value: 3 },
                { label: 'Maio', value: 4 },
                { label: 'Junho', value: 5 },
                { label: 'Julho', value: 6 },
                { label: 'Agosto', value: 7 },
                { label: 'Setembro', value: 8 },
                { label: 'Outubro', value: 9 },
                { label: 'Novembro', value: 10 },
                { label: 'Dezembro', value: 11 },
            ]
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
                <View style={styles.selectContainer}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'ano',
                            value: null
                        }}
                        items={this.state.years}
                        onValueChange={(value) => { this.setState({ year: value }) }}
                        onUpArrow={() => {
                        }}
                        onDownArrow={() => {
                        }}
                        style={{ ...pickerSelectStyles }}
                        value={this.state.year}
                        hideIcon={false}
                        useNativeAndroidPickerStyle={false}
                    />

                    <RNPickerSelect
                        placeholder={{
                            label: 'mês',
                            value: null
                        }}
                        items={this.state.months}
                        onValueChange={(value) => { this.setState({ month: value }) }}
                        onUpArrow={() => {
                        }}
                        onDownArrow={() => {
                        }}
                        style={{ ...pickerSelectStyles }}
                        value={this.state.month}
                        hideIcon={false}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
                <View style={styles.headerSeparator} />
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    selectContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    headerSeparator: {
        alignSelf: 'center',
        width: '80%',
        height: 2,
        backgroundColor: Color.primary2
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 50,
        backgroundColor: Color.primary2,
        color: Color.accent
    },
    inputIOSContainer: {
        marginHorizontal: 10,
        minWidth: 140
    },
    inputAndroid: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 50,
        backgroundColor: Color.primary2,
        color: Color.accent,
    },
});