import { UserCreateModel } from "../models/UserCreateModel"
import { usersQRepository } from "../../../queryRepositories/usersQRepository"
import { usersRepository } from "../../../repositories/usersRepository"


export const usersService = {
    async createUser(createData: UserCreateModel) {

        const usersLoginData = await usersQRepository.getFilterUsers({ login: createData.login })
        if (usersLoginData.length)
            return {
                error: true,
                errorsMessages: [{
                    field: "login",
                    message: "login should be unique"
                }]
            }
        const usersEmailData = await usersQRepository.getFilterUsers({ email: createData.email })
        if (usersEmailData.length)
            return {
                error: true,
                errorsMessages: [{
                    field: "email",
                    message: "email should be unique"
                }]
            }

        const newUser = await usersRepository.createUser(createData)

        return {
            error: false,
            newUser
        }
    }
}