import React, { Component } from 'react'

import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';

// app storage
import { AppStorage } from '../storage/AppStorage'

// moment
import 'moment/locale/pt-br'
import moment from 'moment'

// app colors
import Color from '../color.json'

export default class Ponto extends Component {

    constructor(props) {
        super(props)

        this.state = {
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
            currentEvent: currentEvent,
            entrance: entrance,
            entranceLunch: entranceLunch,
            leaveLunch: leaveLunch,
            leave: leave
        })

    }

    async register(event) {

        // DEBUG
        if (event == 'closed') {
            return
        }

        await AppStorage.registerNow(event)

        let events = await AppStorage.getEvents()

        let currentEvent = await AppStorage.getCurrentEvent()

        this.setState({
            currentEvent: currentEvent,
            entrance: events[0],
            entranceLunch: events[1],
            leaveLunch: events[2],
            leave: events[3]
        })

        Vibration.vibrate()

    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.pontoContainer}>
                    <TouchableOpacity onLongPress={(e) => { this.register(this.state.currentEvent) }}>
                        <View style={styles.ponto}>
                            <Text style={styles.hour}>{moment(new Date()).format('HH:mm:ss')}</Text>
                            <Text style={styles.date}> {moment(new Date()).format('DD [de] MMM')}</Text>
                            <Text style={[styles.liveBalance, { color: Color.secondary }]}>Um horário qualquer</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.registries}>
                    <View style={styles.registry}><Text style={styles.entrance}>{this.state.entrance ? moment(this.state.entrance).format('HH:mm') : ''}</Text></View>
                    <View style={styles.registry}><Text style={styles.entranceLunch}>{this.state.entranceLunch ? moment(this.state.entranceLunch).format('HH:mm') : ''}</Text></View>
                    <View style={styles.registry}><Text style={styles.leaveLunch}>{this.state.leaveLunch ? moment(this.state.leaveLunch).format('HH:mm') : ''}</Text></View>
                    <View style={styles.registry}><Text style={styles.leave}>{this.state.leave ? moment(this.state.leave).format('HH:mm') : ''}</Text></View>
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
        borderColor: '#90ee90',
    },
    hour: {
        fontSize: 40,
        color: '#90ee90'
    },
    date: {
        fontSize: 18,
        color: '#90ee90'
    },
    registries: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    registry: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,0.2)',
        opacity: 0.6
    },
    liveBalance: {
        marginVertical: 10
    },
    entrance: {
        color: 'lightblue'
    },
    entranceLunch: {
        color: 'lightyellow'
    },
    leaveLunch: {
        color: 'lightyellow'
    },
    leave: {
        color: 'lightblue'
    }
});