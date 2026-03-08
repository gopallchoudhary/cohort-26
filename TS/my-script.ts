type userId = string

interface User {
    id: userId
    fname: string
    lname: string
    email: string
    contact: {
        phone: number
    }
    address: {
        street: number,
        pinCode: number,
        country: string
    }
}

class InMemoryDB {
    private _db: Map<userId, User>

    constructor() {
        this._db = new Map()
    }

    public insertUser(data: User): userId {
        if (this._db.has(data.id)) {
            throw new Error(`User with id ${data.id} already exists`)
        }

        this._db.set(data.id, data)
        return data.id
    }

    public updateUser(id: userId, updateData: Omit<User, 'id'>) {
        if (!this._db.has(id)) {
            throw new Error("User not found")
        }

        if (!id) {
            throw new Error("Id is required")
        }

        this._db.set(id, { ...updateData, id })
        return true

    }

    public getUser(id: userId): User {
        if (this._db.has(id)) {
            throw new Error("User not found")
        }

        return this._db.get(id)!
    }
}