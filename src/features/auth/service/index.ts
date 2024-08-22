import { randomUUID } from "crypto";
import { add } from "date-fns";
import { ObjectId } from "mongodb";
import { emailAdapter } from "../../../adapters/emailAdapter";
import { usersQRepository } from "../../../queryRepositories/usersQRepository";
import { blackListTokensRepository } from "../../../repositories/blackListTokensRepository";
import { usersRepository } from "../../../repositories/usersRepository";
import { Result } from "../../../types";
import { compareHash } from "../../../utils/genHash";
import { JWTPayload } from "../../../utils/genJWT";
import { UserModel } from "../../users/models/UserModel";
import { UserUpdateConfirmationModel } from "../../users/models/UserUpdateConfirmationModel";
import { ConfirmationModel } from "../models/ConfirmationModel";
import { LoginCreateModel } from "../models/LoginCreateModel";
import { RegistrationCreateModel } from "../models/RegistrationCreateModel";
import { RegistrationEmailResendingModel } from "../models/RegistrationEmailResendingModel";

export const authService = {
    async login(loginData: LoginCreateModel): Promise<Result<UserModel>> {

        const userLoginData = await usersQRepository.findUsersByOneOfTerms([
            { login: loginData.loginOrEmail },
            { email: loginData.loginOrEmail }
        ])

        if (!userLoginData.length)
            return {
                status: 'BadRequest'
            }

        const isCompare = await compareHash(loginData.password, userLoginData[0].passwordHash)
        if (isCompare) {
            return {
                status: 'Success',
                data: userLoginData[0]

            }
        } else {
            return {
                status: 'BadRequest'
            }
        }
    },
    async registration(registrationData: RegistrationCreateModel): Promise<Result<undefined>> {
        const usersLoginData = await usersQRepository.findUsersByTerm({ login: registrationData.login })
        if (usersLoginData.length)
            return {
                status: 'BadRequest',
                errorMessages: [{ field: 'login', message: 'user already exists' }]
            }
        const usersEmailData = await usersQRepository.findUsersByTerm({ email: registrationData.email })
        if (usersEmailData.length)
            return {
                status: 'BadRequest',
                errorMessages: [{ field: 'email', message: 'user already exists' }]
            }

        const user = await usersRepository.createUser({
            login: registrationData.login,
            email: registrationData.email,
            password: registrationData.password,
        })

        const userDB = await usersQRepository.findUsersByTerm({ _id: new ObjectId(user.id) })

        // emailAdapter.sendMail(userDB[0].email, userDB[0].emailConfirmation.confirmationCode)
        //     .catch((err) => console.error('Send email error', err))

        return {
            status: 'Success'
        }
    },
    async emailResending(resendingData: RegistrationEmailResendingModel): Promise<Result<undefined>> {

        const user = await usersQRepository.findUsersByTerm({ email: resendingData.email })

        if (!user.length)
            return {
                status: 'BadRequest',
                errorMessages: [{ field: 'email', message: 'wrong code' }]
            }
        if (user[0].emailConfirmation.isConfirmed)
            return {
                status: 'BadRequest',
                errorMessages: [{ field: 'email', message: 'wrong code' }]
            }

        const confirmationCode = randomUUID()

        const newConfirmationData: UserUpdateConfirmationModel = {
            ...user[0].emailConfirmation,
            confirmationCode,
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 30,
            }).toISOString(),
        }
        await usersRepository.updateUserConfirmationData(user[0], newConfirmationData)

        // emailAdapter.sendMail(user[0].email, confirmationCode)
        //     .catch((err) => console.error('Send email error', err))

        return {
            status: 'Success'
        }
    },
    async confirmation(confirmationData: ConfirmationModel): Promise<Result<undefined>> {

        const user = await usersQRepository.findUsersByTerm({ 'emailConfirmation.confirmationCode': confirmationData.code })
        if (!user.length) {
            console.log('can`t fount user')
            return {
                status: 'BadRequest',
                errorMessages: [{ field: 'code', message: 'wrong code' }]
            }
        }

        if (user[0].emailConfirmation.isConfirmed) {
            console.log('isConfirmed')
            return {
                status: 'BadRequest',
                errorMessages: [{ field: 'code', message: 'wrong code' }]
            }
        }

        if (new Date(user[0].emailConfirmation.expirationDate) < new Date()) {
            console.log('code date is expired')
            return {
                status: 'BadRequest',
                errorMessages: [{ field: 'code', message: 'wrong code' }]
            }
        }

        const newConfirmationData: UserUpdateConfirmationModel = {
            ...user[0].emailConfirmation,
            isConfirmed: true
        }
        await usersRepository.updateUserConfirmationData(user[0], newConfirmationData)

        return {
            status: 'Success'
        }
    },
    async refreshToken(jwtPayload: JWTPayload): Promise<Result<UserModel>> {
        // if(token)
        // await blackListTokensRepository.createBlackToken(token)

        const userData = await usersQRepository.findUsersByTerm({ _id: new ObjectId(jwtPayload.id) })

        if (!userData || !userData.length)
            return {
                status: 'BadRequest',
            }
        return {
            status: 'Success',
            data: userData[0]
        }
    }
}