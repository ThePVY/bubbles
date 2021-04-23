const arr = [[1, 2, [3, 4]], [9], [10, 12]]

    const arraySum = arr => arr.reduce((acc, item) => item.length ?
        acc + arraySum(item) : acc + item
    , 0)

    let sum = arraySum(arr)

