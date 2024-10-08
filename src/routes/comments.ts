import { JWTPayload } from './../utils/genJWT';
import express, { Request, Response } from 'express'
import { CommentViewModel } from '../features/comments/models/CommentViewModel'
import { validParamId, validationCommentContent, validationLikeStatus } from '../features/comments/validations'
import { UserViewModel } from '../features/users/models/UserViewModel'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { commentsQRepository } from '../queryRepositories/commentsQRepository'
import { commentsRepository } from '../repositories/commentsRepository'
import { ErrorsMessagesType, RequestWithBody, RequestWithParamsAndBody } from '../types'
import { getDeviceInfoByToken, HTTP_STATUSES } from '../utils/helpers'
import { LikeStatus } from '../features/likes/models/LikeStatus'
import { commentsService } from '../features/comments/service';

export const getCommentsRouter = () => {
    const router = express.Router()

    router.get('/:id',
        validParamId(),
        inputValidMiddleware,
        async (req: Request, res: Response<CommentViewModel>) => {

            const token = req.headers.authorization
            const { userId } = getDeviceInfoByToken(token)
            console.log(userId, 'token')

            const foundComment = await commentsService.getCommentWithMyStatus(req.params.id, userId)
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

    router.put('/:commentId/like-status',
        authenticationBearerMiddleware,
        validationLikeStatus(),
        inputValidMiddleware,
        async (req: RequestWithParamsAndBody<{ commentId: string }, { likeStatus: LikeStatus } & JWTPayload>, res: Response<ErrorsMessagesType>) => {

            const updateLike = await commentsService.updateLike(req.params.commentId, req.body.likeStatus, req.body.id)

            if (updateLike.status === 'NotFound') {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            if (updateLike.status === 'Success') {
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
