import { ObjectId } from "mongodb";
import { emailAdapter } from "../../../adapters/emailAdapter";
import { usersQRepository } from "../../../queryRepositories/usersQRepository";
import { usersRepository } from "../../../repositories/usersRepository";
import { Result } from "../../../types";
import { compareHash } from "../../../utils/genHash";
import { LoginCreateModel } from "../models/LoginCreateModel";
import { RegistrationCreateModel } from "../models/RegistrationCreateModel";
import { RegistrationEmailResendingModel } from "../models/RegistrationEmailResendingModel";
import { ConfirmaionModel } from "../models/ConfirmaionModel";
import { UserUpdateConfirmationModel } from "../../users/models/UserUpdateConfirmationModel";
import { randomUUID } from "crypto";
import { add } from "date-fns";

export const authService = {
    async login(loginData: LoginCreateModel) {

        const userLoginData = await usersQRepository.findUsersByOneOfTerms([
            { login: loginData.loginOrEmail },
            { email: loginData.loginOrEmail }
        ])

        if (!userLoginData.length)
            return {
                isCompare: false,
                user: {}
            }

        const isCompare = await compareHash(loginData.password, userLoginData[0].passwordHash)

        return {
            isCompare,
            user: { id: userLoginData[0]._id.toString(), name: userLoginData[0].login }
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

        try {
            await emailAdapter.sendMail(userDB[0].email, userDB[0].emailConfirmation.confirmationCode)
        } catch (err) {
            console.error('Send email error', err);
        }

        return {
            status: 'Success'
        }
    },
    async emailResending(resendingData: RegistrationEmailResendingModel): Promise<Result<undefined>> {

        const user = await usersQRepository.findUsersByTerm({ email: resendingData.email })
        if (!user.length)
            return {
                status: 'BadRequest',
            }
        if (user[0].emailConfirmation.isConfirmed)
            return {
                status: 'BadRequest',
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

        try {
            await emailAdapter.sendMail(user[0].email, confirmationCode)
        } catch (err) {
            console.error('Send email error', err);
        }

        return {
            status: 'Success'
        }
    },
    async confirmation(confirmationData: ConfirmaionModel): Promise<Result<undefined>> {

        const user = await usersQRepository.findUsersByTerm({ 'emailConfirmation.confirmationCode': confirmationData.code })
        if (!user.length) {
            console.log('can`t fount user')
            return {
                status: 'BadRequest',
            }
        }

        if (user[0].emailConfirmation.isConfirmed) {
            console.log('isConfirmed')
            return {
                status: 'BadRequest',
            }
        }

        if (new Date(user[0].emailConfirmation.expirationDate) < new Date()) {
            console.log('code date is expired')
            return {
                status: 'BadRequest',
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
    }
}