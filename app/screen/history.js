import React, { Component } from 'react'

import { StyleSheet, FlatList, Text, View, ActivityIndicator } from 'react-native'

// utils functions
import { getDayBalance } from '../utils/utils'

// app colors
import Color from '../color.json'

// app locale
import AppLocale from '../AppLocale'

// app storage
import { AppStorage } from '../storage/AppStorage';

// moment
import 'moment/locale/pt-br'
import moment from 'moment-business-days'

// select component
import RNPickerSelect from 'react-native-picker-select'

// app registry item
import Registry from '../component/ponto/registry'

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

        let years = await AppStorage.getYears()

        this.setState({
            reload: true,
            locale: locale,
            year: null,
            years: years,
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
            registries: [],
            balanceTotal: {
                minutes: 0,
                text: '----'
            },
            balanceSalary: null
        })

        // ever enter this component
        this.onEnterEvent = this.props.navigation.addListener('didFocus', () => {

            //if (this.state.year != new Date().getFullYear() || this.state.month != new Date().getMonth()) {

            // set list to current year month
            this.setState({
                reload: true,
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                registries: this.changeList(new Date().getFullYear(), new Date().getMonth())
            })

            //}

            setTimeout(() => {
                this.setState({
                    reload: false
                })
            }, 300);

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

    getBalanceText(balanceTotal) {

        let hours = balanceTotal >= 60 || balanceTotal <= -60 ? Math.floor(Math.abs(balanceTotal) / 60) : 0
        let minutes = balanceTotal % 60

        balanceTotalText = hours != 0 ? hours + 'h' : ''
        balanceTotalText += minutes != 0 ? hours != 0 ? Math.abs(minutes) + 'm' : minutes + 'm' : ''

        return {
            minutes: balanceTotal,
            text: balanceTotal != 0 ? balanceTotalText : '----'
        }

    }

    async changeList(year, month = null) {

        let settings = JSON.parse(await AppStorage.settings())

        // get month number of days
        let daysInMonth = moment(new Date(year, month, 1)).daysInMonth()
        let businessDays = 0

        // registries container
        let registries = []

        // create n days registry default object
        for (let i = 0; i < daysInMonth; i++) {

            registries.push({ day: i + 1, entrance: null, entranceLunch: null, leaveLunch: null, leave: null, balance: null })

            if (moment(new Date(this.state.year, this.state.month, i + 1)).isBusinessDay())
                businessDays++

        }

        // get all saved registries from current year and month
        let savedRegistries = await AppStorage.getHistory(year, month)

        // year select or month select not set
        if (year == undefined || month == undefined)
            registries = []

        let balanceTotal = 0

        // merge saved registry to registries list
        for (let i in savedRegistries) {

            let registry = savedRegistries[i]
            let registryDay = i

            // for each list day
            registries.map((_registry) => {

                // if saved registry has an event time, update list day
                if (_registry.day == registryDay) {

                    let entrance = registry[0]
                    let entranceLunch = registry[1]
                    let leaveLunch = registry[2]
                    let leave = registry[3]

                    _registry.entrance = entrance
                    _registry.entranceLunch = entranceLunch
                    _registry.leaveLunch = leaveLunch
                    _registry.leave = leave
                    _registry.balance = getDayBalance(entrance, entranceLunch, leaveLunch, leave, settings.workHour, settings.lunchInterval)

                    balanceTotal += _registry.balance.minutes

                }

            })

        }

        let salaryPerHour = (businessDays, Math.round(settings.salary / businessDays) / 8)
        let balanceSalary = salaryPerHour * (Math.abs(balanceTotal / 60))

        // update list registries
        this.setState({
            reload: true,
            registries: registries,
            balanceTotal: this.getBalanceText(balanceTotal),
            balanceSalary: balanceSalary
        })

        setTimeout(() => {
            this.setState({
                reload: false
            })
        }, 300);

    }

    /**
     * Updates an event time
     * 
     * @param {string} event 
     * @param {date} date 
     * 
     * @return {void}
     */
    async updateEventTime(day, event, date) {

        let settings = JSON.parse(await AppStorage.settings())

        let hour = date.getHours()
        let minutes = date.getMinutes()

        let dateObject = new Date(this.state.year, this.state.month, day, hour, minutes)

        let currentEvent = Object.assign([], this.state.registries)

        let dayEvent = currentEvent[day - 1]

        dayEvent[event] = dateObject

        dayEvent.balance = getDayBalance(dayEvent.entrance, dayEvent.entranceLunch, dayEvent.leaveLunch, dayEvent.leave, settings.workHour, settings.lunchInterval)

        let balanceTotal = 0
        for (let i in currentEvent) {

            let dayEvent = currentEvent[i]

            if (dayEvent.balance)
                balanceTotal += dayEvent.balance.minutes

        }

        this.setState({
            registries: currentEvent,
            balanceTotal: this.getBalanceText(balanceTotal)
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
                    <Registry onChange={this.updateEventTime.bind(this, item.day)} day={item.day} month={this.state.month} year={this.state.year} date={item.entrance} event='entrance'></Registry>
                    <Registry onChange={this.updateEventTime.bind(this, item.day)} day={item.day} month={this.state.month} year={this.state.year} date={item.entranceLunch} event='entranceLunch'></Registry>
                    <Registry onChange={this.updateEventTime.bind(this, item.day)} day={item.day} month={this.state.month} year={this.state.year} date={item.leaveLunch} event='leaveLunch'></Registry>
                    <Registry onChange={this.updateEventTime.bind(this, item.day)} day={item.day} month={this.state.month} year={this.state.year} date={item.leave} event='leave'></Registry>
                    <View style={styles.dayBalanceContainer}>
                        <Text style={[styles.dayBalance, item.balance && item.balance.text == '----' ? styles.dayBalanceNA : item.balance && item.balance.minutes < 0 ? styles.dayBalanceNegative : styles.dayBalancePositive]}>{item.balance ? item.balance.text : ''}</Text>
                    </View>
                </View>
            )
        }

        renderSeparator = () => {
            return <View style={styles.separator} />
        }

        const historyListContent = (
            <View style={{ flex: 1 }}>
                <FlatList style={styles.lista}
                    data={this.state.registries}
                    renderItem={renderItem}
                    keyExtractor={(item, i) => i + ''}
                    ItemSeparatorComponent={renderSeparator}
                />
                <View style={styles.balanceContainer}>
                    <View style={styles.salaryContainer}>
                        <Text style={styles.salary}>{'R$ ' + (2500 - this.state.balanceSalary)}</Text>
                    </View>
                    <Text style={styles.balanceLabel}>{this.state.locale.history.balanceLabel}</Text>
                    <Text style={this.state.balanceTotal.minutes == 0 ? styles.noBalance : this.state.balanceTotal.minutes > 0 ? styles.dayBalancePositive : styles.dayBalanceNegative}>{this.state.balanceTotal.text}</Text>
                </View>
            </View>
        )

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

                {(this.state.reload) ? <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}><ActivityIndicator color={Color.accent} /></View> : historyListContent}

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
        width: '70%',
        height: 1,
        marginLeft: '10%',
        backgroundColor: Color.primary2
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
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
    dayBalanceContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dayBalance: {
        width: 55,
        marginHorizontal: 5
    },
    dayBalancePositive: {
        color: Color.accent
    },
    dayBalanceNegative: {
        color: Color.accent4
    },
    dayBalanceNA: {
        color: Color.secondary
    },
    // /list ----------------------------

    // balance ----------------------------
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopWidth: 2,
        borderTopColor: Color.primary2,
    },
    balanceLabel: {
        flex: 1,
        textAlign: 'right',
        marginRight: 20,
        paddingHorizontal: 10,
        color: Color.secondary
    },
    salary: {
        color: Color.accent
    },
    positiveBalance: {
        color: Color.primary
    },
    negativeBalance: {
        color: Color.accent4
    },
    noBalance: {
        color: Color.secondary
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