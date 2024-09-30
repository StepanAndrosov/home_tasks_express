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

class UsersRepository {
    async testDeleteData() {
        await UserModel.deleteMany({})
    }
    async createUser(createData: CreateUserDto) {
        console.log(createData.email, 'createDataUser')
        const passwordHash = await genHash(createData.password)
        const newUser = UserModel.createUser(createData, passwordHash)
        await newUser.save()

        return getViewModelUser(newUser)
    }
    async updateUserConfirmationData(id: ObjectId, updateData: UserUpdateConfirmationModel) {
        const foundUser = await UserModel.findOne({ _id: id })
        if (!foundUser) return false
        foundUser.emailConfirmation = updateData
        await foundUser.save()
        return true
    }
    async updateUserRecoveryPasswordData(id: ObjectId, updateData?: UserUpdateRecoveryPasswordModel) {
        const foundUser = await UserModel.findOne({ _id: id })
        if (!foundUser) return false
        foundUser.resendPasswordConfirmation = updateData
        await foundUser.save()
        return true
    }
    async updateUserPassword(id: ObjectId, newPassword: string) {
        const foundUser = await UserModel.findOne({ _id: id })
        if (!foundUser) return false
        const passwordHash = await genHash(newPassword)
        foundUser.passwordHash = passwordHash
        await foundUser.save()
        return true
    }
    async deleteUser(id: string) {
        await UserModel.deleteOne({ _id: new ObjectId(id) })
    }
}

export const usersRepository = new UsersRepository()