import { ObjectId } from "mongodb";
import { usersCollection } from "../db/db";
import { UserCreateModel } from "../features/users/models/UserCreateModel";
import { UserModel } from "../features/users/models/UserModel";
import { UserViewModel } from "../features/users/models/UserViewModel";
import { genHash } from "../utils/genHash";

export const getViewModelUser = (user: UserModel): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const usersRepository = {
    async testDeleteData() {
        await usersCollection.drop()
    },
    async createUser(createData: UserCreateModel) {

        const passwordHash = await genHash(createData.password)

        const newUser = {
            _id: new ObjectId(),
            login: createData.login,
            email: createData.email,
            password: passwordHash,
            createdAt: new Date(Date.now()).toISOString()
        }

        await usersCollection.insertOne(newUser)

        return getViewModelUser(newUser)
    },
    async deleteUser(id: string) {
        await usersCollection.deleteOne({ _id: new ObjectId(id) })
    }
}