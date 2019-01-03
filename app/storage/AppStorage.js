import { AsyncStorage } from 'react-native'

/**
 * Class with static methods to handle app storage
 */
export class AppStorage {

    // ********************
    // ***** SETTINGS ***** 
    // ********************

    /**
     * Get app settings
     * 
     * @return {promise}
     */
    static async settings() {

        // get current settings
        let settings = await AsyncStorage.getItem('settings')

        // settings not set yet
        if (!settings)
            AsyncStorage.setItem('settings', JSON.stringify({

                /**
                 * Work hour by day - default 8 hours
                 * 
                 * @type {number}
                 */
                workHour: 8,

                /**
                 * Lunch interval - default 1 hour
                 * 
                 * @type {number}
                 */
                lunchInterval: 1,

                /**
                 * Salary - default 900
                 */
                salary: 900

            }))

        return await AsyncStorage.getItem('settings')

    }

    /**
     * Reset settings to default
     * 
     * @return {void}
     */
    static async clearSettings() {
        AsyncStorage.setItem('settings', JSON.stringify({
            workHour: 8,
            lunchInterval: 1,
            salary: 900
        }))
    }

    /**
     * Updates work hour settings
     * 
     * @param {number} hour 
     * 
     * @return {void}
     */
    static async updateWorkHour(hour) {

        // change object to be saved
        let change = {
            workHour: hour
        }

        // save to app storage
        await AsyncStorage.mergeItem('settings', JSON.stringify(change))

    }

    /**
     * Updates lunch interval settings
     * 
     * @param {number} interval 
     * 
     * @return {void}
     */
    static async updateLunchInterval(interval) {

        // change object to be saved
        let change = {
            lunchInterval: interval
        }

        // save to app storage
        await AsyncStorage.mergeItem('settings', JSON.stringify(change))

    }

    /**
     * Updates work salary
     * 
     * @param {number} salary
     * 
     * @return {void} 
     */
    static async updateSalary(salary) {

        // change object to be saved
        let change = {
            salary: salary
        }

        // save to app storage
        await AsyncStorage.mergeItem('settings', JSON.stringify(change))

    }


    // ********************
    // ***** APP DATA ***** 
    // ********************

    /**
     * Get all app history
     * 
     * @return {promise}
     */
    static async allHistory() {

        // get app history
        let history = await AsyncStorage.getItem('history')

        // history not set yet
        if (!history)
            AsyncStorage.setItem('history', JSON.stringify({}))

        return await AsyncStorage.getItem('history')
    }

    /**
     * Get years from app history [2018, 2019, ...etc]
     * 
     * @return {array}
     */
    static async getYears() {

        // get all history
        let allHistory = await AppStorage.allHistory()

        // years
        let years = Object.keys(JSON.parse(allHistory))

        // current year
        let currentYear = new Date().getFullYear()

        // saved years has current year
        let hasCurrentYear = years.includes(currentYear + '')

        // current year not saved yet
        if (!hasCurrentYear) years.push(currentYear)

        // prepare return array
        let _return = []

        // for each year found
        years.map((year) => {
            _return.push({
                label: year + '',
                value: parseInt(year)
            })
        })

        return _return

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
        let change = {}
        change[year] = {}
        change[year][month] = {}
        // take already saved day events
        change[year][month][day] = allHistory[year][month][day]
        // add/update day event
        change[year][month][day][eventIndex] = new Date(year, month, day, hour, minutes, seconds)

        // save to app storage
        AsyncStorage.mergeItem('history', JSON.stringify(change))

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

        // deletes registries by year
        if (year && (!month && !day && !event)) {
            toDelete = {}
            toDelete[year] = null
            AsyncStorage.mergeItem('history', JSON.stringify(toDelete))
        }

        // deletes registries by month
        if (year && (month && !day && !event)) {
            toDelete = {}
            toDelete[year] = {}
            toDelete[year][month] = null
            AsyncStorage.mergeItem('history', JSON.stringify(toDelete))
        }

        // deletes registries by day
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
     * Get year/month object
     * 
     * @param {number} year
     * @param {number} month
     * 
     * @return {object} 
     */
    static async getHistory(year, month = null) {

        if (!year) return []

        let history = await AppStorage.allHistory()

        history = JSON.parse(history)

        // get year only
        if (month == null) {
            return history[year]
        } else {
            if (history[year]) {
                return history[year][month]
            } else {
                return []
            }
        }

    }

    /**
     * Get an especific date event or today event
     * 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @param {string} event 
     * 
     * @return {boolean}
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
                return null
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