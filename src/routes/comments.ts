import express, { Request, Response } from 'express'
import { UserCreateModel } from '../features/users/models/UserCreateModel'
import { UsersPaginateModel } from '../features/users/models/UserPaginateModel'
import { UserViewModel } from '../features/users/models/UserViewModel'
import { validationEmail, validationLogin, validationPassword } from '../features/users/validations'
import { authenticationBasicMiddleware } from '../middlewares/authentication-basic'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { usersQRepository } from '../queryRepositories/usersQRepository'
import { usersRepository } from '../repositories/usersRepository'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { HTTP_STATUSES, sanitizeQuery } from '../utils/helpers'
import { usersService } from '../features/users/service'
import { CommentsPaginateModel } from '../features/comments/models/CommentsPaginateModel'
import { commentsQRepository } from '../queryRepositories/commentsQRepository'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { validationCommentContent } from '../features/comments/validations'
import { commentsRepository } from '../repositories/commentsRepository'

export const getCommentsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request<{}, {}, {}, { [key: string]: string | undefined }>, res: Response<CommentsPaginateModel>) => {

        const sanitizedUsersQuery = sanitizeQuery(req.query)

        const comments = await commentsQRepository.getComments(sanitizedUsersQuery)
        res.json(comments)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.put('/:commentId',
        authenticationBearerMiddleware,
        validationCommentContent(),
        inputValidMiddleware,
        async (req: Request, res: Response<ErrorsMessagesType>) => {

            const foundComment = await commentsQRepository.findComment(req.params.commentId)
            if (!foundComment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            await commentsRepository.updateComment(foundComment, { content: req.body.content })

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:commentId',
        authenticationBearerMiddleware,
        async (req: Request, res: Response<UserViewModel>) => {
            const foundComment = await commentsQRepository.findComment(req.params.commentId)
            if (!foundComment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            await commentsRepository.deleteComment(req.params.commentId)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
