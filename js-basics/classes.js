
// class User {
//     constructor(name, score) {
//         this.name = name
//         this.score = score
//     }

//     increment() {
//         this.score++
//     }
// }

// const user1 = new User("Gopal", 99)

// user1.increment()
// console.log(User.prototype.score);

// console.log(typeof User);



class User {
    constructor(name, score) {
        this.name = name
        this.score = score
    }
    login() {
        console.log("Logged in");
    }

    
}


class Admin extends User {
    constructor(name, score, isAdmin) {
        super(name, score)
        this.isAdmin = isAdmin
    }
    deleteUser() {
        console.log("user deleted");
    }
}


const admin = new Admin("Gopal", 100, true)
admin.login()