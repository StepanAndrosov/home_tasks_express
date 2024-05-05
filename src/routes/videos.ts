import express, { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { VideoIdParamsModel } from '../features/videos/models/VideoIdParamsModel'
import { VideoViewModel } from '../features/videos/models/VideoViewModel'
import { VideoCreateModel } from '../features/videos/models/VodeoCreateModel'
import { canBeDownloadedValidator, minAgeRestrictionValidator, validationAuthor, validationPublicationDate, validationResolutions, validationTitle } from '../features/videos/validations'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { videosRepository } from '../repositories/videosRepository'
import { Error, ErrorsMessagesType, RequestWithBody, RequestWithParams } from '../types'
import { HTTP_STATUSES, } from '../utils'


export const getVideosRouter = () => {
    const router = express.Router()

    router.get('/', (req: Request, res: Response<VideoViewModel[]>) => {
        const videos = videosRepository.getVideos()
        res.json(videos)
        res.sendStatus(HTTP_STATUSES.OK_200)
    })

    router.post('/',
        validationTitle(),
        validationAuthor(),
        validationResolutions(),
        inputValidMiddleware,
        (req: RequestWithBody<VideoCreateModel>, res: Response<VideoViewModel | ErrorsMessagesType>) => {

            const newVideo = videosRepository.createVideo(req.body)
            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(newVideo)
        })

    router.get('/:id',
        (req: RequestWithParams<VideoIdParamsModel>, res: Response<VideoViewModel>) => {
            const errorsData = validationResult(req)
            if (!errorsData.isEmpty()) {
                res.status(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const foundVideo = videosRepository.findVideo(Number(req.params.id))
            if (!foundVideo) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            res.json(foundVideo)
            res.sendStatus(HTTP_STATUSES.OK_200)
        })

    router.put('/:id',
        validationTitle(),
        validationAuthor(),
        validationResolutions(),
        canBeDownloadedValidator(),
        minAgeRestrictionValidator(),
        validationPublicationDate(),
        inputValidMiddleware,
        (req: Request, res: Response<ErrorsMessagesType>) => {

            const foundVideo = videosRepository.findVideo(+req.params.id)
            if (!foundVideo) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const foundindex = videosRepository.findIndex(foundVideo)

            if (foundindex < 0) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            videosRepository.updateVideo(foundindex, foundVideo, req.body)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:id', (req: RequestWithParams<VideoIdParamsModel>, res: Response<VideoViewModel>, next: NextFunction) => {
        const foundVideo = videosRepository.findVideo(+req.params.id)
        if (!foundVideo) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        const foundindex = videosRepository.findIndex(foundVideo)

        if (foundindex < 0) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        videosRepository.deleteVideo(foundindex)

        res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
    })

    return router
}
