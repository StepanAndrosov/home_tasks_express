import { ObjectId } from "mongodb";
import { usersCollection } from "../db/db";
import { UserCreateModel } from "../features/users/models/UserCreateModel";
import { UserModel } from "../features/users/models/UserModel";
import { UserViewModel } from "../features/users/models/UserViewModel";
import { genHash } from "../utils/genHash";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { UserUpdateConfirmationModel } from "../features/users/models/UserUpdateConfirmationModel";

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
        console.log(createData.email, 'createDataUser')
        const passwordHash = await genHash(createData.password)

        const newUser = {
            _id: new ObjectId(),
            login: createData.login,
            email: createData.email,
            passwordHash: passwordHash,
            createdAt: new Date(Date.now()).toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }).toISOString(),
                isConfirmed: false
            }
        }

        await usersCollection.insertOne(newUser)

        return getViewModelUser(newUser)
    },
    async updateUserConfirmationData(user: UserModel, updateData: UserUpdateConfirmationModel) {
        const newUser = {
            ...user,
            emailConfirmation: updateData
        }
        await usersCollection.updateOne({ _id: newUser._id }, { $set: newUser })
    },
    async deleteUser(id: string) {
        await usersCollection.deleteOne({ _id: new ObjectId(id) })
    }
}