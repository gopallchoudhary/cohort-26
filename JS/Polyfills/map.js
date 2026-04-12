const arr = [1, 2, 3, 4, 5]

Array.prototype.myMap = function (callbackFn) {

    if (typeof callbackFn !== 'function') {
        throw new Error("Callback is not function")
    }

    let result = new Array(this.length) // is case me sparse array banta hai => array which has missing or empty indexes

    let flag = 0;

    while (flag < this.length) {
        if (this.hasOwnProperty(flag)) {
            const newValue = callbackFn(this[flag], flag, this)
            result[flag] = newValue
        }

        flag++
    }

    return result;
}



const twice = arr.myMap((elem) => elem * 2)
console.log(twice);


