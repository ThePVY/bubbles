const findEdges = (code) => {
    let arr = code.toString(2).split('')
    console.log(arr)
    arr = [ ...arr, arr[0] ]
    return arr.reduce((acc, num, i, arr) => {
        if(i < arr.length - 1) {
            return arr[i] === arr[i+1] ? [...acc, '0'] : [...acc, '1']
        }
        return acc
    }, [])
}

const findMask = (code) => {
    let arr = code.toString(2).split('')
    console.log(arr)
    let source = [...arr, ...arr].join('')
    return source.search('010')
}

console.log(findEdges(0b1000000))

console.log( findMask(0b10101) )

debugger