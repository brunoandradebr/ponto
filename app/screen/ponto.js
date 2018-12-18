import React, { Component } from 'react'

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

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
            currentEvent: 'entrance',
            currentTime: new Date()
        }

        setInterval(() => {
            this.setState({
                currentTime: new Date()
            })
        }, 1000)

    }

    async componentDidMount() {

        history = await AppStorage.allHistory()

        console.log(history)

    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.pontoContainer}>
                    <TouchableOpacity onLongPress={(e) => { }}>
                        <View style={styles.ponto}>
                            <Text style={styles.hour}>{moment(new Date()).format('HH:mm:ss')}</Text>
                            <Text style={styles.date}> {moment(new Date()).format('DD [de] MMM')}</Text>
                            <Text style={[styles.liveBalance, { color: Color.secondary }]}>Um horário qualquer</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.registries}>
                    <View style={styles.registry}><Text style={styles.entrance}>09:30</Text></View>
                    <View style={styles.registry}><Text style={styles.entranceLunch}>11:30</Text></View>
                    <View style={styles.registry}><Text style={styles.leaveLunch}>12:30</Text></View>
                    <View style={styles.registry}><Text style={styles.leave}>18:30</Text></View>
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