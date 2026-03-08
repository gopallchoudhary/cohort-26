const arr = [1, 2, 3, 4]

Array.prototype.forEach = null

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback) {
        for(let i =0; i<this.length; i++) {
            callback(this[i], i, this)
        }
    }
}


const arr2 = arr.forEach((value, index, array) => {
    console.log(`Value: ${value}, Index: ${index}, Array: ${array}`)
})


