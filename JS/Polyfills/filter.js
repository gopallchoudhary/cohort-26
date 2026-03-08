// const arr = [1,2,3,4,5,6]
// const obj = {name: "Gopal"}

// function filterFunction(dataArray, callbackFn, thisArg) {
//     const result = []

//     for(let i =0; i<dataArray.length; i++) {
//         const value = dataArray[i]
//         const newValue = callbackFn.call(thisArg, value, i, dataArray)

//         newValue && result.push(value)
//     }

//     return result
// }

// function transformFunction(value, index, array) {
//     console.log(this);

//     return value % 2 === 0
// }


// const myResult = filterFunction(arr, transformFunction, obj)
// console.log(myResult);



const arr = [1, 2, 3, 4, 5, 6]

Array.prototype.myFilter = function (callbackFn) {
    if (typeof callbackFn !== 'function') {
        throw new Error("Callback function is required")
    }
    let result = []
    let flag = 0
    while (flag < this.length) {
        if (this.hasOwnProperty(flag)) {
            const value = this[flag]

            const isTrue = callbackFn(value, flag, this)

            isTrue && result.push(value)
        }
        flag++
    }

    return result
}

const result = arr.myFilter((elem) => elem % 2 === 0)
console.log(result);
