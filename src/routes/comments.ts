import express, { Request, Response } from 'express'
import { CommentParamsModel } from '../features/comments/models/CommentParamsModel'
import { CommentViewModel } from '../features/comments/models/CommentViewModel'
import { validationCommentContent } from '../features/comments/validations'
import { UserViewModel } from '../features/users/models/UserViewModel'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { commentsQRepository } from '../queryRepositories/commentsQRepository'
import { commentsRepository } from '../repositories/commentsRepository'
import { ErrorsMessagesType, RequestWithParams } from '../types'
import { HTTP_STATUSES } from '../utils/helpers'

export const getCommentsRouter = () => {
    const router = express.Router()

    router.get('/:id', async (req: RequestWithParams<CommentParamsModel>, res: Response<CommentViewModel>) => {

        const foundComment = await commentsQRepository.findComment(req.params.id)
        if (!foundComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundComment)
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
