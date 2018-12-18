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

        let history = await AsyncStorage.getItem('history')

        if (!history) {
            AsyncStorage.setItem('history', JSON.stringify([]))
        }

        return await AsyncStorage.getItem('history')

    }

    static async save(year, month, day, hour, minutes, seconds, event) {

        let allHistory = await AppStorage.allHistory()

        console.log(allHistory)

    }

    static edit() { }
    static delete() { }
    static getHistory() { }
    static getYear() { }
    static getMonth() { }
    static getDay() { }
}