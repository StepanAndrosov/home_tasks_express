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
            return false

        const isCompare = await compareHash(loginData.password, userLoginData[0].password)

        return isCompare
    }
}