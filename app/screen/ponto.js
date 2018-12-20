import React, { Component } from 'react'

import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native'

// app storage
import { AppStorage } from '../storage/AppStorage'

// app locale
import AppLocale from '../AppLocale'

// registry component
import Registry from '../component/ponto/registry'

// moment
import 'moment/locale/pt-br'
import moment from 'moment'

// app colors
import Color from '../color.json'

export default class Ponto extends Component {

    constructor(props) {
        super(props)

        this.state = {
            locale: null,
            currentEvent: null,
            entrance: null,
            entranceLunch: null,
            leaveLunch: null,
            leave: null,
            currentTime: new Date()
        }

        setInterval(() => {
            this.setState({
                currentTime: new Date()
            })
        }, 1000)

    }

    async componentDidMount() {

        // get today events
        let events = await AppStorage.getEvents()

        let entrance = events[0]
        let entranceLunch = events[1]
        let leaveLunch = events[2]
        let leave = events[3]

        // get current event
        let currentEvent = await AppStorage.getCurrentEvent()

        // update events state
        this.setState({
            locale: await AppLocale.translate(),
            currentEvent: currentEvent,
            entrance: entrance,
            entranceLunch: entranceLunch,
            leaveLunch: leaveLunch,
            leave: leave
        })

        // ever enter this component
        this.onEnterEvent = this.props.navigation.addListener('didFocus', () => {
        })

    }

    componentWillUnmount() {
        this.onEnterEvent.remove();
    }

    /**
     * Register current event
     * 
     * @param {string} event 
     * 
     * @return {void}
     */
    async register(event) {

        // vibrate feedback
        Vibration.vibrate()

        // if registered all events
        if (event == 'closed') {
            //AppStorage.clear()
            return
        }

        // register current time
        await AppStorage.registerNow(event)

        // get all registered events
        let events = await AppStorage.getEvents()

        // get current event
        let currentEvent = await AppStorage.getCurrentEvent()

        // update state
        this.setState({
            currentEvent: currentEvent,
            entrance: events[0],
            entranceLunch: events[1],
            leaveLunch: events[2],
            leave: events[3]
        })
    }

    /**
     * Updates an event time
     * 
     * @param {string} event 
     * @param {date} date 
     * 
     * @return {void}
     */
    updateEventTime(event, date) {

        // modifier
        let state = {}
        // modifies an event time
        state[event] = date.toString()
        // update state
        this.setState(state)
    }

    render() {

        // not loaded locale object yet
        if (!this.state.locale) return null

        return (
            <View style={styles.container}>

                <View style={styles.pontoContainer}>
                    <TouchableOpacity onLongPress={(e) => { this.register(this.state.currentEvent) }}>
                        <View style={styles.ponto}>
                            <Text style={styles.hour}>{moment(new Date()).format('HH:mm:ss')}</Text>
                            <Text style={styles.date}> {moment(new Date()).format('DD [de] MMM')}</Text>
                            <Text style={[styles.liveBalance, { color: Color.secondary }]}>{this.state.locale.ponto.balanceMessage}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.registries}>
                    <Registry date={this.state.entrance} onChange={this.updateEventTime.bind(this)} event='entrance'></Registry>
                    <Registry date={this.state.entranceLunch} onChange={this.updateEventTime.bind(this)} event='entranceLunch'></Registry>
                    <Registry date={this.state.leaveLunch} onChange={this.updateEventTime.bind(this)} event='leaveLunch'></Registry>
                    <Registry date={this.state.leave} onChange={this.updateEventTime.bind(this)} event='leave'></Registry>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pontoContainer: {
        flex: 3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ponto: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 250,
        borderWidth: 1,
        borderRadius: 150,
        borderColor: Color.accent,
    },
    hour: {
        fontSize: 40,
        color: Color.accent
    },
    date: {
        fontSize: 18,
        color: Color.accent
    },
    liveBalance: {
        marginVertical: 10
    },
    registries: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
})