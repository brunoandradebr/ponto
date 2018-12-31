
import moment from 'moment'

export const getDayBalance = (entrance, entranceLunch, leaveLunch, leave, workHour = 8, lunchInterval = 1, suposeLeave = false) => {

    if (entrance && suposeLeave) {

        let date = new Date()
        entranceLunch = entranceLunch ? entranceLunch : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 30)
        leaveLunch = leaveLunch ? leaveLunch : entranceLunch ? moment(entranceLunch).add(lunchInterval * 60, 'm') : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 30)
        leave = leave ? leave : new Date()

    }

    if (entrance && entranceLunch && leaveLunch && leave) {

        entrance = new Date(entrance)
        entranceLunch = new Date(entranceLunch)
        leaveLunch = new Date(leaveLunch)
        leave = new Date(leave)

        let diffLunch = moment.duration(moment(leaveLunch).diff(moment(entranceLunch)))
        let diffLunchMinutes = diffLunch.asMinutes()

        let leaveTime = moment(entrance).add(workHour /* <-- work time */ + lunchInterval /* <-- lunch time */, 'h').subtract(diffLunchMinutes - (lunchInterval * 60), 'm')

        let diffEntrance = moment.duration(moment(leave).diff(leaveTime))
        let diffEntranceMinutes = diffEntrance.asMinutes()

        let balance = diffEntrance.toISOString().replace('PT', '').toLocaleLowerCase()

        balance = balance.split('m')[0]

        let hasMinute = balance.split('h')[1]

        balance = balance != 'p0d' && hasMinute || balance < 60 ? balance + 'm' : balance

        return balance != 'p0d' ? { minutes: diffEntranceMinutes, text: balance } : { minutes: diffEntranceMinutes, text: '----' }

    }

    return { minutes: 0, text: '----' }

}