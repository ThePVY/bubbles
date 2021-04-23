//{ firstname = 'Ivan', lastname = 'Ivanov' } = {} -> можно вызывать функцию без параметров
//{ firstname = 'Ivan', lastname = 'Ivanov' } -> хотя бы один параметр нужно передать
/*
Помимо прочего destructuring of function parameters помогает придерживаться концепции
чистых функций, так как создается слабая копия передаваемых параметров и внутри функции
работа ведется с копиями
*/
let lordify = ({ firstname = 'Ivan', lastname = 'Ivanov' } = {}) => {
    console.log(`${firstname} of Caterberry ${lastname}`)
}

lordify()

lordify({firstname: 'Galya'})

lordify('Galya')
/*---------------------------------------------------------------------------------*/
let person = {
    firstname: 'Default',
    lastname: 'Defaultov'
}

lordify = ({ firstname = 'Ivan', lastname = 'Ivanov' } = {}) => {
    firstname = 'Gula'
    lastname = 'Zalupova'
    console.log(`${firstname} of Caterberry ${lastname}`)
}

lordify(person)
/*---------------------------------------------------------------------------------*/
person = {
    firstname: 'Default',
    lastname: 'Defaultov',
    spouce: {
        firstname: 'Defaulta',
        lastname: 'Defaultova'
    }
}

lordify = ({ spouce: { firstname = 'Defaulta' } = {} } = {}) => {
    console.log(`${firstname} of Caterberry`)
}

lordify(person)
lordify()
/*---------------------------------------------------------------------------------*/
debugger