import { AsyncStorage } from 'react-native'

export class AppStorage {

    /**
     * Take app full history
     * 
     * @return {array}
     */
    static async allHistory() {

        let history = await AsyncStorage.getItem('history')

        if (!history)
            AsyncStorage.setItem('history', JSON.stringify({}))

        return await AsyncStorage.getItem('history')

    }

    /**
     * Add/update a day registry
     * 
     * ex: AppStorage.save(2018, 1, 10, 9, 30, 0, 'entrance')
     * 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @param {number} hour 
     * @param {number} minutes 
     * @param {number} seconds 
     * @param {string} event [entrance|entranceLunch|leaveLunch|leave]
     * 
     * @return {void} 
     */
    static async register(year, month, day, hour, minutes, seconds, event) {

        // get app history
        let allHistory = await AppStorage.allHistory()

        // parse app history to object
        allHistory = JSON.parse(allHistory)

        // create year, month and day object if it's empty
        if (!allHistory[year]) allHistory[year] = {}
        if (!allHistory[year][month]) allHistory[year][month] = {}
        if (!allHistory[year][month][day]) allHistory[year][month][day] = []

        // get event as index
        let eventIndex = AppStorage._getEventIndex(event)

        // prepare an object to be saved
        let toSave = {}
        toSave[year] = {}
        toSave[year][month] = {}
        // take already saved day events
        toSave[year][month][day] = allHistory[year][month][day]
        // add/update day event
        toSave[year][month][day][eventIndex] = new Date(year, month, day, hour, minutes, seconds)

        // save to app storage
        AsyncStorage.mergeItem('history', JSON.stringify(toSave))

    }

    /**
     * Register current time to an event day
     * 
     * @param {string} event 
     * 
     * @return {void}
     */
    static async registerNow(event) {

        let year = new Date().getFullYear()
        let month = new Date().getMonth()
        let day = new Date().getDate()
        let hour = new Date().getHours()
        let minutes = new Date().getMinutes()
        let seconds = new Date().getSeconds()

        await AppStorage.register(year, month, day, hour, minutes, seconds, event)
    }

    /**
     * Deletes a register
     * 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day
     * @param {string} event
     * 
     * @return {void} 
     */
    static async delete(year, month = null, day = null, event = null) {

        // deletes a year
        if (year && (!month && !day && !event)) {
            toDelete = {}
            toDelete[year] = null
            AsyncStorage.mergeItem('history', JSON.stringify(toDelete))
        }

        // deletes a month
        if (year && (month && !day && !event)) {
            toDelete = {}
            toDelete[year] = {}
            toDelete[year][month] = null
            AsyncStorage.mergeItem('history', JSON.stringify(toDelete))
        }

        // deletes a day
        if (year && (month && day && !event)) {
            toDelete = {}
            toDelete[year] = {}
            toDelete[year][month] = {}
            toDelete[year][month][day] = []
            AsyncStorage.mergeItem('history', JSON.stringify(toDelete))
        }

        // deletes an event
        if (year && (month && day && event)) {

            // get current app history
            toDelete = await AppStorage.allHistory()

            // parse to object
            toDelete = JSON.parse(toDelete)

            // get event index
            let eventIndex = AppStorage._getEventIndex(event)

            // if event is set, remove it
            if (toDelete[year][month][day]) {
                if (toDelete[year][month][day][eventIndex]) {
                    toDelete[year][month][day][eventIndex] = null
                }
            }

            // update app history
            AsyncStorage.mergeItem('history', JSON.stringify(toDelete))
        }

    }

    /**
     * Get year object
     * 
     * @param {number} year
     * 
     * @return {object} 
     */
    static async getHistory(year) {
        let history = await AppStorage.allHistory()
        history = JSON.parse(history)
        return history[year]
    }

    /**
     * Get an especific date event or today event
     * 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @param {string} event 
     * 
     * @return {array}
     */
    static async getEvent(year = null, month = null, day = null, event = null) {

        // get an especific event in a especific date
        if (year && month && day && event) {
            let eventIndex = AppStorage._getEventIndex(event)
            let history = await AppStorage.getHistory(year)
            return history[month][day][eventIndex]
        }

        if (arguments.length == 1) {
            let eventIndex = AppStorage._getEventIndex(arguments[0])
            let today = new Date()
            let history = await AppStorage.getHistory(today.getFullYear())
            if (history && history[today.getMonth()]) {
                return history[today.getMonth()][today.getDate()][eventIndex]
            } else {
                return []
            }
        }

    }

    /**
     * Get today events
     * 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day
     * 
     * @return {array} 
     */
    static async getEvents(year = null, month = null, day = null) {

        // get an especific event in a especific date
        if (year && month && day && event) {
            let history = await AppStorage.getHistory(year)
            return history[month][day]
        } else {
            let today = new Date()
            let history = await AppStorage.getHistory(today.getFullYear())
            if (history && history[today.getMonth()]) {
                if (history[today.getMonth()][today.getDate()]) {
                    return history[today.getMonth()][today.getDate()]
                } else {
                    return []
                }
            } else {
                return []
            }
        }

    }

    /**
     * Get today current event
     * 
     * @return {string}
     */
    static async getCurrentEvent() {

        // get today events
        let events = await AppStorage.getEvents()

        let entrance = events[0]
        let entranceLunch = events[1]
        let leaveLunch = events[2]
        let leave = events[3]

        let currentEvent = 'entrance'

        if (entrance)
            currentEvent = 'entranceLunch'
        if (entranceLunch)
            currentEvent = 'leaveLunch'
        if (leaveLunch)
            currentEvent = 'leave'
        if (leave)
            currentEvent = 'closed'

        return currentEvent

    }

    /**
     * Get event index
     * 
     * 0 => entrance
     * 1 => entranceLunch
     * 2 => leaveLunch
     * 3 => leave
     * 4 => closed
     * 
     * @param {string} event 
     * 
     * @return {number}
     */
    static _getEventIndex(event) {
        switch (event) {
            case 'entrance': return 0; break
            case 'entranceLunch': return 1; break
            case 'leaveLunch': return 2; break
            case 'leave': return 3; break
            case 'closed': return 4; break
        }
    }

    /**
     * Clear all app history
     * 
     * CAUTION
     * 
     * @return {void}
     */
    static async clear() {
        await AsyncStorage.removeItem('history')
    }

}