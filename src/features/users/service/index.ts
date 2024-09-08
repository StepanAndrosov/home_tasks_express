import { usersQRepository } from "../../../queryRepositories/usersQRepository"
import { usersRepository } from "../../../repositories/usersRepository"
import { CreateUserDto } from "../domain/CreateUserDto"


export const usersService = {
    async createUser(createData: CreateUserDto) {

        const usersLoginData = await usersQRepository.findUsersByTerm({ login: createData.login })
        if (usersLoginData.length)
            return {
                error: true,
                errorsMessages: [{
                    field: "login",
                    message: "login should be unique"
                }]
            }
        const usersEmailData = await usersQRepository.findUsersByTerm({ email: createData.email })
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