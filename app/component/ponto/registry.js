import React, { Component } from 'react'

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// app storage
import { AppStorage } from '../../storage/AppStorage'

// time picker
import DateTimePicker from 'react-native-modal-datetime-picker';

// moment
import 'moment/locale/pt-br'
import moment from 'moment'

// app colors
import Color from '../../color.json'

export default class Registry extends Component {

    constructor(props) {
        super(props)

        this.state = {
            date: null,
            defaultDate: new Date(),
            timePickerVisible: false
        }

    }

    /**
     * when close/open time picker
     * 
     * @return {void}
     */
    toggleTimePicker = () => {
        this.setState({ timePickerVisible: !this.state.timePickerVisible, date: new Date(this.props.date) })
    }

    /**
     * handler picked date
     * 
     * @param {string} event
     * @param {date} date
     * 
     * @return {void}
     */
    handleDatePicked = async (event, date) => {

        // get date information from picked date
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()

        // save event time to history
        await AppStorage.register(year, month, day, hour, minute, 0, event)

        // close time picker
        this.toggleTimePicker()

        // update date object
        this.setState({
            date: date
        })

        // callback after changing time
        if (this.props.onChange)
            this.props.onChange(event, date)

    }

    render() {

        // get time text from date property
        let dateText = this.props.date ? moment(new Date(this.props.date)).format('HH:mm') : ''

        return (
            <View style={styles.container}>
                <View style={styles.registry}>
                    <TouchableOpacity onPress={() => this.toggleTimePicker()}>
                        <Text style={styles[this.props.event]}>{dateText}</Text>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    mode='time'
                    date={this.state.date ? this.state.date : this.state.defaultDate}
                    isVisible={this.state.timePickerVisible}
                    onConfirm={this.handleDatePicked.bind(this, this.props.event)}
                    onCancel={this.toggleTimePicker}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    registry: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 3,
        minHeight: 30,
        maxHeight: 30,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    entrance: {
        color: Color.accent2
    },
    entranceLunch: {
        color: Color.accent3
    },
    leaveLunch: {
        color: Color.accent3
    },
    leave: {
        color: Color.accent2
    }
});