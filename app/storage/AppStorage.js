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

    private currentHistory() {

        let history = AsyncStorage.getItem('history')

        if (!history) {

        }

        console.log(history)

    }

    static save(year, month, day, hour, minutes, seconds, event) {

        this.currentHistory()

    }

    static edit() { }
    static delete() { }
    static getHistory() { }
    static getYear() { }
    static getMonth() { }
    static getDay() { }
}