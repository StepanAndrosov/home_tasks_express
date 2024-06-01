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
import { HTTP_STATUSES, sanitizeQuery } from '../utils'

export const getUsersRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request<{}, {}, {}, { [key: string]: string | undefined }>, res: Response<UsersPaginateModel>) => {

        const sanitizedQuery = sanitizeQuery(req.query)

        const users = await usersQRepository.getUsers(sanitizedQuery)
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

            const newUser = await usersRepository.createUser(req.body)
            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(newUser)
        })

    router.delete('/:id',
        authenticationMiddleware,
        async (req: Request, res: Response<UserViewModel>) => {
            const foundUser = await usersRepository.findUser(req.params.id)
            if (!foundUser) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            await usersRepository.deleteUser(req.params.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
