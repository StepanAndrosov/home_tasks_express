import express, { Request, Response } from 'express'
import { CommentViewModel } from '../features/comments/models/CommentViewModel'
import { validParamId, validationCommentContent } from '../features/comments/validations'
import { UserViewModel } from '../features/users/models/UserViewModel'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { commentsQRepository } from '../queryRepositories/commentsQRepository'
import { commentsRepository } from '../repositories/commentsRepository'
import { ErrorsMessagesType } from '../types'
import { HTTP_STATUSES } from '../utils/helpers'

export const getCommentsRouter = () => {
    const router = express.Router()

    router.get('/:id',
        validParamId(),
        inputValidMiddleware,
        async (req: Request, res: Response<CommentViewModel>) => {

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
            if (req.body.id !== foundComment?.commentatorInfo.userId) {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
                return
            }
            const updated = await commentsRepository.updateComment(req.params.commentId, req.body.content)
            if (updated) {
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
                return
            }
        })

    router.delete('/:commentId',
        authenticationBearerMiddleware,
        async (req: Request, res: Response<UserViewModel>) => {
            const foundComment = await commentsQRepository.findComment(req.params.commentId)
            if (!foundComment) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            if (req.body.id !== foundComment?.commentatorInfo.userId) {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
                return
            }
            await commentsRepository.deleteComment(req.params.commentId)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
