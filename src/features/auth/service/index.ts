import { ObjectId } from "mongodb";
import { emailAdapter } from "../../../adapters/emailAdapter";
import { usersQRepository } from "../../../queryRepositories/usersQRepository";
import { usersRepository } from "../../../repositories/usersRepository";
import { Result } from "../../../types";
import { compareHash } from "../../../utils/genHash";
import { LoginCreateModel } from "../models/LoginCreateModel";
import { RegistrationCreateModel } from "../models/RegistrationCreateModel";
import { RegistrationEmailResendingModel } from "../models/RegistrationCreateModel copy";

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

        const userBD = await usersQRepository.findUsersByTerm({ _id: new ObjectId(user.id) })

        try {
            await emailAdapter.sendMail(userBD[0].email, userBD[0].emailConfirmation.confirmationCode)
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

        try {
            await emailAdapter.sendMail(user[0].email, user[0].emailConfirmation.confirmationCode)
        } catch (err) {
            console.error('Send email error', err);
        }

        return {
            status: 'Success'
        }
    }
}