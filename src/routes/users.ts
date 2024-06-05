import express, { Request, Response } from 'express'
import { UserCreateModel } from '../features/users/models/UserCreateModel'
import { UsersPaginateModel } from '../features/users/models/UserPaginateModel'
import { UserViewModel } from '../features/users/models/UserViewModel'
import { validationEmail, validationLogin, validationPassword } from '../features/users/validations'
import { authenticationMiddleware } from '../middlewares/authentication '
import { inputValidMiddleware } from '../middlewares/input-valid'
import { usersQRepository } from '../queryRepositories/usersQRepository'
import { usersRepository } from '../repositories/usersRepository'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { HTTP_STATUSES, sanitizeUsersQuery } from '../utils/helpers'
import { usersService } from '../features/users/service'

export const getUsersRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request<{}, {}, {}, { [key: string]: string | undefined }>, res: Response<UsersPaginateModel>) => {

        const sanitizedUsersQuery = sanitizeUsersQuery(req.query)

        const users = await usersQRepository.getUsers(sanitizedUsersQuery)
        res.json(users)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.post('/',
        authenticationMiddleware,
        validationLogin(),
        validationEmail(),
        validationPassword(),
        inputValidMiddleware,
        async (req: RequestWithBody<UserCreateModel>, res: Response<UserViewModel | ErrorsMessagesType>) => {

            const createDataUser = await usersService.createUser(req.body)

            if (createDataUser.error && createDataUser.errorsMessages) {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: createDataUser.errorsMessages
                })
                return
            }

            const newUser = createDataUser.newUser
            if (newUser)
                res
                    .status(HTTP_STATUSES.CREATED_201)
                    .send(newUser)
        })

    router.delete('/:id',
        authenticationMiddleware,
        async (req: Request, res: Response<UserViewModel>) => {
            const foundUser = await usersQRepository.findUserById(req.params.id)
            if (!foundUser) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            await usersRepository.deleteUser(req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
