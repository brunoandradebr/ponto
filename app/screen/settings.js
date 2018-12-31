import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native';

// app locale
import AppLocale from '../AppLocale'

// app storage
import { AppStorage } from '../storage/AppStorage'

// app colors
import Color from '../color.json'

// select component
import RNPickerSelect from 'react-native-picker-select'

export default class Settings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            locale: null,
            hour: 8,
            lunchInterval: 1,
            hours: [{ label: '1h', value: 1 }, { label: '2h', value: 2 }, { label: '3h', value: 3 }, { label: '4h', value: 4 }, { label: '5h', value: 5 }, { label: '6h', value: 6 }, { label: '7h', value: 7 }, { label: '8h', value: 8 }, { label: '9h', value: 9 }, { label: '10h', value: 10 }, { label: '11h', value: 11 }, { label: '12h', value: 12 }],
            lunchIntervals: [{ label: '15m', value: 0.25 }, { label: '30m', value: 0.5 }, { label: '1h', value: 1 }]
        }

    }

    async componentDidMount() {

        let settings = JSON.parse(await AppStorage.settings())

        // get locale object
        this.setState({
            locale: await AppLocale.translate(),
            hour: settings.workHour,
            lunchInterval: settings.lunchInterval
        })

        // ever enter this component
        this.onEnterEvent = this.props.navigation.addListener('didFocus', () => { })

    }

    componentWillUnmount() {
        this.onEnterEvent.remove();
    }

    async onChangeHours(hour) {

        this.setState({
            hour: hour ? hour : this.state.hour
        })

        await AppStorage.updateWorkHour(hour)

    }

    async onChangeLunchInterval(interval) {

        this.setState({
            lunchInterval: interval ? interval : this.state.lunchInterval
        })

        await AppStorage.updateLunchInterval(interval)

    }

    render() {

        // not loaded locale object yet
        if (!this.state.locale) return null

        return (
            <View style={styles.container}>
                <View style={styles.menuItem}>
                    <Text style={styles.label}>{this.state.locale.settings.workHour}</Text>
                    <View style={styles.component}>
                        <RNPickerSelect
                            items={this.state.hours}
                            placeholder={{
                                label: this.state.locale.settings.workLabel,
                                value: null
                            }}
                            onValueChange={(value) => { this.onChangeHours(value) }}
                            style={{ ...pickerSelectStyles }}
                            value={this.state.hour}
                            hideIcon={true}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>
                </View>

                <View style={styles.menuItem}>
                    <Text style={styles.label}>{this.state.locale.settings.lunchInterval}</Text>
                    <View style={styles.component}>
                        <RNPickerSelect
                            items={this.state.lunchIntervals}
                            placeholder={{
                                label: this.state.locale.settings.lunchLabel,
                                value: null
                            }}
                            onValueChange={(value) => { this.onChangeLunchInterval(value) }}
                            style={{ ...pickerSelectStyles }}
                            value={this.state.lunchInterval}
                            hideIcon={true}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    label: {
        textTransform: 'uppercase',
        width: 230,
        color: Color.secondary
    },
    component: {
    }
})

// select component styles
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
        width: 60
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
})