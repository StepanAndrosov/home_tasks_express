import mongoose, { HydratedDocument, Model } from "mongoose";
import { IUserModel } from "../models/IUserModel";
import { CreateUserDto } from "./CreateUserDto";
import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { add } from "date-fns";

type UserMethods = typeof userMethods;
type UserStatics = typeof userStatics;

type UserModelType = Model<IUserModel, {}, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<IUserModel, UserMethods>;

export const UserSchema = new mongoose.Schema<IUserModel, UserModelType, UserMethods>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String },
    createdAt: { type: String },
    emailConfirmation: {
        confirmationCode: { type: String },
        expirationDate: { type: String },
        isConfirmed: { type: Boolean },
    },
    resendPasswordConfirmation: {
        recoveryCode: { type: String },
        expirationDate: { type: String }
    }
})

const userMethods = {}
const userStatics = {
    createUser(dto: CreateUserDto, passwordHash: string) {
        const newUser = new UserModel()

        newUser._id = new ObjectId()
        newUser.login = dto.login
        newUser.email = dto.email
        newUser.passwordHash = passwordHash
        newUser.createdAt = new Date(Date.now()).toISOString()

        newUser.emailConfirmation = {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 30,
            }).toISOString(),
            isConfirmed: false
        }
        return newUser
    }
}

UserSchema.methods = userMethods;
UserSchema.statics = userStatics;

export const UserModel = mongoose.model<IUserModel, UserModelType>('user', UserSchema)