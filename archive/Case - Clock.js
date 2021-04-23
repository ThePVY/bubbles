const compose = (...fns) => (startArg) => {
    return fns.reduce((acc, fn) => fn(acc), startArg)
}

const oneSecond = () => 1000
const getCurrentTime = () => new Date()
const clear = () => console.clear()
const log = (message) => console.log(message)

const serializeTime = dateObj => ({
    hours: dateObj.getHours(),
    minutes: dateObj.getMinutes(),
    seconds: dateObj.getSeconds()
})

const civilianHours = serializedTime => ({
    ...serializedTime,
    hours: serializedTime.hours > 12 ? serializedTime.hours - 12 : serializedTime.hours 
})

const setAMPM = serializedTime => ({
    ...serializedTime,
    ampm: serializedTime.hours >= 12 ? 'PM' : 'AM'
})

const display = fn => time => fn(time)

const formatClock = str4format => serializedTime => str4format
    .replace('hh', serializedTime.hours)
    .replace('mm', serializedTime.minutes)
    .replace('ss', serializedTime.seconds)
    .replace('tt', serializedTime.ampm)

const prependZero = key => serializedTime => {
    return ({
        ...serializedTime,
        [key]: serializedTime[key] < 10 ? '0' + serializedTime[key] : serializedTime[key]
    })
}

const convertToCivilianTime = serializedTime => compose(
    setAMPM,
    civilianHours
)(serializedTime)

const convertToDoubleDigits = civilianTime => compose(
    prependZero('hours'),
    prependZero('minutes'),
    prependZero('seconds')
)(civilianTime)

/*--------------------------------------------------------------------*/

const startTicking = () => {
    setInterval(compose(
        clear,
        getCurrentTime,
        serializeTime,
        convertToCivilianTime,
        convertToDoubleDigits,
        formatClock('hh:mm:ss tt'),
        display(log)
    ), oneSecond())
}

startTicking()

