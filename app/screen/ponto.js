import React, { Component } from 'react'

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// app storage
import { Storage } from '../storage/AppStorage'

// moment
import 'moment/locale/pt-br'
import moment from 'moment'

// app colors
import Color from '../color.json'

export default class Ponto extends Component {

    constructor(props) {
        super(props)

        this.state = {
            horaAtual: new Date()
        }

        setInterval(() => {
            this.setState({
                horaAtual: new Date()
            })
        }, 1000)

        Storage.save(2018, 12, 14, 9, 30, 0, 'entrada')

    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.pontoContainer}>
                    <TouchableOpacity onLongPress={(e) => { }}>
                        <View style={styles.ponto}>
                            <Text style={styles.hora}>{moment(new Date()).format('HH:mm:ss')}</Text>
                            <Text style={styles.data}> {moment(new Date()).format('DD [de] MMM')}</Text>
                            <Text style={[styles.saldoTempoReal, { color: Color.secondary }]}>Um horário qualquer</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.registros}>
                    <View style={styles.registro}><Text style={styles.entrada}>09:30</Text></View>
                    <View style={styles.registro}><Text style={styles.entradaAlmoco}>11:30</Text></View>
                    <View style={styles.registro}><Text style={styles.saidaAlmoco}>12:30</Text></View>
                    <View style={styles.registro}><Text style={styles.saida}>18:30</Text></View>
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
    hora: {
        fontSize: 40,
        color: '#90ee90'
    },
    data: {
        fontSize: 18,
        color: '#90ee90'
    },
    registros: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    registro: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,0.2)',
        opacity: 0.6
    },
    saldoTempoReal: {
        marginVertical: 10
    },
    entrada: {
        color: 'lightblue'
    },
    entradaAlmoco: {
        color: 'lightyellow'
    },
    saidaAlmoco: {
        color: 'lightyellow'
    },
    saida: {
        color: 'lightblue'
    }
});