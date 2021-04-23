const getPeople = (count) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(count)
        }, 3000)
    })
}

getPeople(5)
    .then((count) => console.log(count + 1))

console.log('----')


const print = message => console.log(message)
const printSec = (number) => new Promise((resolve) => setTimeout(() => resolve(number), 1000))

printSec(3)
    .then((number) => {
        print(number)
        return printSec(2)
    })
    .then((number) => {
        print(number)
        return printSec(1)
    })
    .then((number) => {
        print(number)
    })

