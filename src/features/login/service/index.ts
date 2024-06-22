import { usersQRepository } from "../../../queryRepositories/usersQRepository";
import { compareHash } from "../../../utils/genHash";
import { LoginCreateModel } from "../models/LoginCreateModel";

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

        const isCompare = await compareHash(loginData.password, userLoginData[0].password)

        console.log('isCompare', isCompare, { id: userLoginData[0]._id.toString(), name: userLoginData[0].login })

        return {
            isCompare,
            user: { id: userLoginData[0]._id.toString(), name: userLoginData[0].login }
        }
    }
}