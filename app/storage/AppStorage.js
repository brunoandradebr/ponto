import { AsyncStorage } from 'react-native'

// {
//     2018 : [{
//         0: {
//             14: {
//                 [
//                     "2018-12-14 09:30:00",
//                     "2018-12-14 09:30:00",
//                     "2018-12-14 09:30:00",
//                     "2018-12-14 09:30:00"
//                 ]
// }
//         }
//     }]
// }

export class AppStorage {

    /**
     * Take app full history
     * 
     * @return {array}
     */
    static async allHistory() {

        //AsyncStorage.removeItem('history')

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
        let eventIndex = 0
        switch (event) {
            case 'entrance': eventIndex = 0; break
            case 'entranceLunch': eventIndex = 1; break
            case 'leaveLunch': eventIndex = 2; break
            case 'leave': eventIndex = 3; break
        }

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
    static registerNow(event) {

        let year = new Date().getFullYear()
        let month = new Date().getMonth()
        let day = new Date().getDate()
        let hour = new Date().getHours()
        let minutes = new Date().getMinutes()
        let seconds = new Date().getSeconds()

        AppStorage.register(year, month, day, hour, minutes, seconds, event)
    }

    /**
     * Deletes a register
     * 
     * @param {number} year 
     * @param {number} month 
     * @param {number} day
     * 
     * @return {void} 
     */
    static async delete(year, month = null, day = null) {

        // deletes a year
        if (year && (!month && !day)) {
            toDelete = {}
            toDelete[year] = null
            AsyncStorage.mergeItem('history', JSON.stringify(toDelete))
        }

    }

}