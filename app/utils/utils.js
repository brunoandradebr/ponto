import moment from 'moment'

export const getDayBalance = (entrance, entranceLunch, leaveLunch, leave, suposeLeave = false) => {

    if (entrance && suposeLeave) {

        let date = new Date()
        entranceLunch = entranceLunch ? entranceLunch : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 30)
        leaveLunch = leaveLunch ? leaveLunch : entranceLunch ? moment(entranceLunch).add(1, 'h') : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 30)
        leave = leave ? leave : new Date()

    }

    if (entrance && entranceLunch && leaveLunch && leave) {

        entrance = new Date(entrance)
        entranceLunch = new Date(entranceLunch)
        leaveLunch = new Date(leaveLunch)
        leave = new Date(leave)

        let diffLunch = moment.duration(moment(leaveLunch).diff(moment(entranceLunch)))
        let diffLunchMinutes = diffLunch.asMinutes()

        let leaveTime = moment(entrance).add(8 /* <-- work time */ + 1 /* <-- lunch time */, 'h').subtract(60 - diffLunchMinutes, 'm')

        let diffEntrance = moment.duration(moment(leave).diff(leaveTime))
        let diffEntranceMinutes = diffEntrance.asMinutes()

        let balance = diffEntrance.toISOString().replace('PT', '').toLocaleLowerCase().substring(0, 6)

        return balance != 'p0d' ? { minutes: diffEntranceMinutes, text: balance } : { minutes: diffEntranceMinutes, text: '----' }

    }

    return { minutes: 0, text: '----' }

}