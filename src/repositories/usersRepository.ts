import { ObjectId } from "mongodb";
import { postsCollection, usersCollection } from "../db/db";
import { PostCreateModel } from "../features/posts/models/PostCreateModel";
import { PostUpdateModel } from "../features/posts/models/PostUpdateModel";
import { PostViewModel } from "../features/posts/models/PostViewModel";
import { UserModel } from "../features/users/models/UserModel";
import { UserViewModel } from "../features/users/models/UserViewModel";
import { UserCreateModel } from "../features/users/models/UserCreateModel";

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
    async findUser(id: string) {
        const userData = await usersCollection.findOne({ _id: new ObjectId(id) })
        if (!userData) return null
        return getViewModelUser(userData)
    },
    async createUser(createData: UserCreateModel) {
        const newUser = {
            _id: new ObjectId(),
            login: createData.login,
            email: createData.email,
            password: createData.password,
            createdAt: new Date(Date.now()).toISOString()
        }

        await usersCollection.insertOne(newUser)

        return getViewModelUser(newUser)
    },
    async deleteUser(id: string) {
        await usersCollection.deleteOne({ _id: new ObjectId(id) })
    }
}