import { ObjectId } from "mongodb";
import { CreateUserDto } from "../features/users/domain/CreateUserDto";
import { UserModel } from "../features/users/domain/user.entity";
import { IUserModel } from "../features/users/models/IUserModel";
import { UserUpdateConfirmationModel } from "../features/users/models/UserUpdateConfirmationModel";
import { UserViewModel } from "../features/users/models/UserViewModel";
import { genHash } from "../utils/genHash";
import { UserUpdateRecoveryPasswordModel } from "../features/users/models/UserUpdateRecoveryPasswordModel";

export const getViewModelUser = (user: IUserModel): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const usersRepository = {
    async testDeleteData() {
        await UserModel.deleteMany({})
    },
    async createUser(createData: CreateUserDto) {
        console.log(createData.email, 'createDataUser')
        const passwordHash = await genHash(createData.password)
        const newUser = UserModel.createUser(createData, passwordHash)
        await newUser.save()

        return getViewModelUser(newUser)
    },
    async updateUserConfirmationData(id: ObjectId, updateData: UserUpdateConfirmationModel) {
        const foundedUser = await UserModel.findOne({ _id: id })
        if (!foundedUser) return false
        foundedUser.emailConfirmation = updateData
        await foundedUser.save()
        return true
    },
    async updateUserRecoveryPasswordData(id: ObjectId, updateData?: UserUpdateRecoveryPasswordModel) {
        const foundedUser = await UserModel.findOne({ _id: id })
        if (!foundedUser) return false
        foundedUser.resendPasswordConfirmation = updateData
        await foundedUser.save()
        return true
    },
    async updateUserPassword(id: ObjectId, newPassword: string) {
        const foundedUser = await UserModel.findOne({ _id: id })
        if (!foundedUser) return false
        const passwordHash = await genHash(newPassword)
        foundedUser.passwordHash = passwordHash
        await foundedUser.save()
        return true
    },
    async deleteUser(id: string) {
        await UserModel.deleteOne({ _id: new ObjectId(id) })
    }
}