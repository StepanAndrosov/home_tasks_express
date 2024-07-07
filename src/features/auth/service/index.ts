import { usersQRepository } from "../../../queryRepositories/usersQRepository";
import { usersRepository } from "../../../repositories/usersRepository";
import { compareHash } from "../../../utils/genHash";
import { LoginCreateModel } from "../models/LoginCreateModel";
import { RegistrationCreateModel } from "../models/RegistrationCreateModel";

export const loginService = {
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
    async registration(registrationData: RegistrationCreateModel) {
        const userRegistrationData = await usersQRepository.findUsersByOneOfTerms([
            { login: registrationData.login },
            { email: registrationData.email }
        ])
        if (userRegistrationData.length)
            return null

        return await usersRepository.createUser({
            login: registrationData.login,
            email: registrationData.email,
            password: registrationData.password,
        })

    }
}