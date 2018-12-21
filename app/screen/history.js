import React, { Component } from 'react'

import { StyleSheet, FlatList, Text, View } from 'react-native'

// app colors
import Color from '../color.json'

// app locale
import AppLocale from '../AppLocale'

// app storage
import { AppStorage } from '../storage/AppStorage';

// moment
import 'moment/locale/pt-br'
import moment from 'moment'

// select component
import RNPickerSelect from 'react-native-picker-select'

// app registry item
import Registry from '../component/ponto/registry'
//import RegistryItem from '../component/history/registryItem'

export default class History extends Component {

    constructor(props) {
        super(props)

        this.state = {
            locale: null
        }

    }

    async componentDidMount() {

        // get locale object
        let locale = await AppLocale.translate()

        this.setState({
            locale: locale,
            year: null,
            // TODO - get years from saved registries
            years: [
                { label: '2018', value: 2018 }
            ],
            month: null,
            months: [
                { label: locale.history.month0, value: 0 },
                { label: locale.history.month1, value: 1 },
                { label: locale.history.month2, value: 2 },
                { label: locale.history.month3, value: 3 },
                { label: locale.history.month4, value: 4 },
                { label: locale.history.month5, value: 5 },
                { label: locale.history.month6, value: 6 },
                { label: locale.history.month7, value: 7 },
                { label: locale.history.month8, value: 8 },
                { label: locale.history.month9, value: 9 },
                { label: locale.history.month10, value: 10 },
                { label: locale.history.month11, value: 11 },
            ],
            registries: []
        })

        // ever enter this component
        this.onEnterEvent = this.props.navigation.addListener('didFocus', () => {

            //if (this.state.year != new Date().getFullYear() || this.state.month != new Date().getMonth()) {

            // set list to current year month
            this.setState({
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                registries: this.changeList(new Date().getFullYear(), new Date().getMonth())
            })

            //}

        })
    }

    onChangeYear(year) {

        this.setState({ year: year })

        this.changeList(year, this.state.month)

    }

    onChangeMonth(month) {

        this.setState({ month: month })

        this.changeList(this.state.year, month)

    }

    async changeList(year, month = null) {

        // get month number of days
        let daysInMonth = moment(new Date(year, month, 1)).daysInMonth()

        // registries container
        let registries = []

        // create n days registry default object
        for (let i = 0; i < daysInMonth; i++) {
            registries.push({ day: i + 1, entrance: null, entranceLunch: null, leaveLunch: null, leave: null })
        }

        // get all saved registries from current year and month
        let savedRegistries = await AppStorage.getHistory(year, month)

        // year select or month select not set
        if (year == undefined || month == undefined)
            registries = []

        // merge saved registry to registries list
        for (let i in savedRegistries) {

            let registry = savedRegistries[i]
            let registryDay = i

            // for each list day
            registries.map((_registry) => {
                // if saved registry has an event time, update list day
                if (_registry.day == registryDay) {
                    _registry.entrance = registry[0]
                    _registry.entranceLunch = registry[1]
                    _registry.leaveLunch = registry[2]
                    _registry.leave = registry[3]
                }
            })

        }

        // update list registries
        this.setState({
            registries: registries
        })

    }

    componentWillUnmount() {
        this.onEnterEvent.remove();
    }

    render() {

        // not loaded locale object yet
        if (!this.state.locale) return null

        renderItem = ({ item }) => {
            return (
                <View style={styles.item}>
                    <View style={styles.dayContainer}>
                        <Text style={styles.day}>{item.day}</Text>
                    </View>
                    <Registry onChange={this.changeList.bind(this, this.state.year, this.state.month)} date={item.entrance} event='entrance'></Registry>
                    <Registry onChange={this.changeList.bind(this, this.state.year, this.state.month)} date={item.entranceLunch} event='entranceLunch'></Registry>
                    <Registry onChange={this.changeList.bind(this, this.state.year, this.state.month)} date={item.leaveLunch} event='leaveLunch'></Registry>
                    <Registry onChange={this.changeList.bind(this, this.state.year, this.state.month)} date={item.leave} event='leave'></Registry>
                    <Text style={styles.dayBalance}>{'+18min'}</Text>
                </View>
            )
        }

        renderSeparator = () => {
            return <View style={styles.separator} />
        }

        return (
            <View style={styles.container}>
                <View style={styles.selectContainer}>
                    <RNPickerSelect
                        placeholder={{
                            label: this.state.locale.history.year,
                            value: null
                        }}
                        items={this.state.years}
                        onValueChange={(value) => { this.onChangeYear(value) }}
                        style={{ ...pickerSelectStyles }}
                        value={this.state.year}
                        hideIcon={false}
                        useNativeAndroidPickerStyle={false}
                    />

                    <RNPickerSelect
                        placeholder={{
                            label: this.state.locale.history.month,
                            value: null
                        }}
                        items={this.state.months}
                        onValueChange={(value) => { this.onChangeMonth(value) }}
                        style={{ ...pickerSelectStyles }}
                        value={this.state.month}
                        hideIcon={false}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>

                <View style={styles.headerSeparator} />

                <FlatList style={styles.lista}
                    data={this.state.registries}
                    renderItem={renderItem}
                    keyExtractor={(item, i) => i + ''}
                    ItemSeparatorComponent={renderSeparator}
                />

                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>{this.state.locale.history.balanceLabel}</Text>
                    <Text style={styles.noBalance}>{'----'}</Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    // header ----------------------------
    selectContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    headerSeparator: {
        alignSelf: 'center',
        width: '100%',
        height: 2,
        backgroundColor: Color.primary2
    },
    // /header ----------------------------

    // list ----------------------------
    lista: {
        flex: 1,
    },
    separator: {
        width: '85%',
        height: 1,
        marginLeft: '10%',
        backgroundColor: Color.primary2
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    dayContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    day: {
        color: Color.secondary,
        fontSize: 14,
        width: 20,
        marginHorizontal: 5
    },
    dayBalance: {
        marginHorizontal: 5,
        color: Color.accent
    },
    // /list ----------------------------

    // balance ----------------------------
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 20,
        borderTopWidth: 2,
        borderTopColor: Color.primary2,
    },
    balanceLabel: {
        flex: 1,
        textAlign: 'right',
        marginRight: 20,
        color: Color.secondary,
    },
    positiveBalance: {
        paddingHorizontal: 10,
        color: Color.primary
    },
    negativeBalance: {
        paddingHorizontal: 10,
        color: '#f46'
    },
    noBalance: {
        color: Color.secondary,
        paddingHorizontal: 10,
    }
    // /balance ----------------------------
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
})