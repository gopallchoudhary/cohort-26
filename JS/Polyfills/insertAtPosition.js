Array.prototype.insertAtPosition = function (value, position) {
    // If the value of position is negative or greater than the length of array then it simply returns the original array without inserting
    if (position < 0 || position > this.length) {
        return this
    }

    for (let i = this.length; i > position; i--) {
        this[i] = this[i - 1]
    }

    this[position] = value
    return this

}

const arr = [1, 2, 3, 4]

arr.insertAtPosition(5, -1) // output: [1,2,3,4]
arr.insertAtPosition(5, 8) // outpurt: [1,2,3,4]

arr.insertAtPosition(5, 1) // output: [1,5,2,3,4]
console.log(arr);

