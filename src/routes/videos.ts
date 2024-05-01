import express, { NextFunction, Request, Response } from 'express'
import { VideoIdParamsModel } from '../features/videos/models/VideoIdParamsModel'
import { VideoUpdateModel } from '../features/videos/models/VideoUpdateModel'
import { VideoViewModel } from '../features/videos/models/VideoViewModel'
import { VideoCreateModel } from '../features/videos/models/VodeoCreateModel'
import { videosRepository } from '../repositories/videosRepository'
import { DBType, Error, ErrorsMessagesType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, Resolution } from '../types'
import { HTTP_STATUSES, availableResolutions, validLengthFields } from '../utils'

const isInvalidResolutions = (availableResolutionsData?: Resolution[]) => !availableResolutionsData ||
    !availableResolutionsData.length ?
    true :
    !!availableResolutionsData.filter(r => !availableResolutions.includes(r as Resolution)).length

const isInvalidTitle = (title?: string) => !title || !title.trim() || title.length > validLengthFields.videoTitle

const isInvalidAuthor = (author?: string) => !author || !author.trim() || author.length > validLengthFields.videoAuthor

export const getVideosRouter = () => {
    const router = express.Router()

    router.get('/', (req: Request, res: Response<VideoViewModel[]>, next: NextFunction) => {
        const videos = videosRepository.getVideos()
        res.json(videos)
        res.sendStatus(HTTP_STATUSES.OK_200)
    })

    router.post('/', (req: RequestWithBody<VideoCreateModel>, res: Response<VideoViewModel | ErrorsMessagesType>, next: NextFunction) => {

        const errorsMessages = [] as Error[]

        if (isInvalidResolutions(req.body.availableResolutions as undefined | Resolution[])) {
            errorsMessages.push({
                message: 'Bad Resolutions',
                field: 'availableResolutions'
            })
        }

        if (isInvalidTitle(req.body.title)) {
            errorsMessages.push({
                message: 'Bad Title',
                field: 'title'
            })
        }

        if (isInvalidAuthor(req.body.author)) {
            errorsMessages.push({
                message: 'Bad Author',
                field: 'author'
            })
        }

        if (errorsMessages.length) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                errorsMessages
            })
            return
        }
        const newVideo = videosRepository.createVideo(req.body)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(newVideo)
    })

    router.get('/:id', (req: RequestWithParams<VideoIdParamsModel>, res: Response<VideoViewModel>, next: NextFunction) => {
        const foundVideo = videosRepository.findVideo(Number(req.params.id))
        if (!foundVideo) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundVideo)
        res.sendStatus(HTTP_STATUSES.OK_200)
    })

    router.put('/:id', (req: RequestWithParamsAndBody<VideoIdParamsModel, VideoUpdateModel>, res: Response<ErrorsMessagesType>, next: NextFunction) => {

        if (!req.params.id || isNaN(Number(req.params.id))) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

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

        const errorsMessages = [] as Error[]

        if (isInvalidResolutions(req.body.availableResolutions as undefined | Resolution[])) {
            errorsMessages.push({
                message: 'Bad Resolutions',
                field: 'availableResolutions'
            })
        }
        if (isInvalidTitle(req.body.title)) {
            errorsMessages.push({
                message: 'Bad Title',
                field: 'title'
            })
        }
        if (isInvalidAuthor(req.body.author)) {
            errorsMessages.push({
                message: 'Bad Author',
                field: 'author'
            })
        }

        if (typeof req.body.canBeDownloaded !== 'boolean') {
            errorsMessages.push({
                message: 'Bad type Can Be Downloaded',
                field: 'canBeDownloaded'
            })
        }

        if (isNaN(+req.body.minAgeRestriction) || +req.body.minAgeRestriction < 1 || +req.body.minAgeRestriction > 18) {
            errorsMessages.push({
                message: 'Bad Min Age Restriction',
                field: 'minAgeRestriction'
            })
        }

        if (typeof req.body.publicationDate !== 'string' || !req.body.publicationDate.toString().trim()) {
            errorsMessages.push({
                message: 'Bad Publication Date',
                field: 'publicationDate'
            })
        }

        if (errorsMessages.length) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                errorsMessages
            })
            return
        }

        // const newVideo = {
        //     ...foundVideo,
        //     ...req.body,
        //     minAgeRestriction: req.body.minAgeRestriction ? +req.body.minAgeRestriction : foundVideo ? foundVideo.minAgeRestriction : null
        // } as VideoModel

        // db.videos.splice(foundindex, 1, newVideo)

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
