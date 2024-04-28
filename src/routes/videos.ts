import express, { NextFunction, Request, Response } from 'express'
import { db } from '../db/db'
import { VideoViewModel } from '../features/videos/models/VideoViewModel'
import { HTTP_STATUSES, availableResolutions, validLengthFields } from '../utils'
import { ErrorType, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, Resolution } from '../types'
import { VideoCreateModel } from '../features/videos/models/VodeoCreateModel'
import { VideoIdParamsModel } from '../features/videos/models/VideoIdParamsModel'
import { VideoUpdateModel } from '../features/videos/models/VideoUpdateModel'
import { VideoModel } from '../features/videos/models/VideoModel'

const getVideosRouter = express.Router()

getVideosRouter.get('/', (req: Request, res: Response<VideoViewModel[]>, next: NextFunction) => {
    console.log("Videos Router Working");
    res.json(db.videos)
    res.sendStatus(HTTP_STATUSES.OK_200)
})

const isInvalidResolutions = (availableResolutionsData?: Resolution[]) => !availableResolutionsData ||
    !availableResolutionsData.length ?
    true :
    !!availableResolutionsData.filter(r => !availableResolutions.includes(r as Resolution)).length

const isInvalidTitle = (title?: string) => !title || !title.trim() || title.length > validLengthFields.videoTitle

const isInvalidAuthor = (author?: string) => !author || !author.trim() || author.length > validLengthFields.videoAuthor

getVideosRouter.post('/', (req: RequestWithBody<VideoCreateModel>, res: Response<VideoViewModel | ErrorType>, next: NextFunction) => {

    if (isInvalidResolutions(req.body.availableResolutions as undefined | Resolution[])) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Resolutions',
                    field: 'availableResolutions'
                }
            ]
        })
        return
    }

    if (isInvalidTitle(req.body.title)) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Title',
                    field: 'title'
                }
            ]
        })
        return
    }

    if (isInvalidAuthor(req.body.author)) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Author',
                    field: 'author'
                }
            ]
        })
        return
    }

    const newVideo = {
        id: +Date.now(),
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions as Resolution[],
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
    }

    db.videos.push(newVideo)
    res.json(newVideo)
    res.sendStatus(HTTP_STATUSES.CREATED_201)
})

getVideosRouter.get('/:id', (req: RequestWithParams<VideoIdParamsModel>, res: Response<VideoViewModel>, next: NextFunction) => {
    const foundVideo = db.videos.find(v => v.id === Number(req.params.id))
    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.json(foundVideo)
    res.sendStatus(HTTP_STATUSES.OK_200)
})

getVideosRouter.put('/:id', (req: RequestWithParamsAndBody<VideoIdParamsModel, VideoUpdateModel>, res: Response<ErrorType>, next: NextFunction) => {
    console.log(req.body, 'params')

    if (!req.params.id || isNaN(Number(req.params.id))) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const foundVideo = db.videos.find(v => v.id === Number(req.params.id))
    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const foundindex = db.videos.indexOf(foundVideo!)

    if (foundindex < 0) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    if (isInvalidResolutions(req.body.availableResolutions as undefined | Resolution[])) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Resolutions',
                    field: 'availableResolutions'
                }
            ]
        })
        return
    }
    if (isInvalidTitle(req.body.title)) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Title',
                    field: 'title'
                }
            ]
        })
        return
    }
    if (isInvalidAuthor(req.body.author)) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Author',
                    field: 'author'
                }
            ]
        })
        return
    }

    if (typeof req.body.canBeDownloaded !== 'boolean') {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad type Can Be Downloaded',
                    field: 'canBeDownloaded'
                }
            ]
        })
        return
    }

    if (isNaN(+req.body.minAgeRestriction) || +req.body.minAgeRestriction < 1 || +req.body.minAgeRestriction > 18) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Min Age Restriction',
                    field: 'minAgeRestriction'
                }
            ]
        })
        return
    }

    if (!req.body.publicationDate.trim()) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorMessages: [
                {
                    message: 'Bad Publication Date',
                    field: 'publicationDate'
                }
            ]
        })
        return
    }

    const newVideo = {
        ...foundVideo,
        ...req.body,
        minAgeRestriction: req.body.minAgeRestriction ? +req.body.minAgeRestriction : foundVideo ? foundVideo.minAgeRestriction : null
    } as VideoModel

    db.videos.splice(foundindex, 1, newVideo)

    res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
})

getVideosRouter.delete('/:id', (req: RequestWithParams<VideoIdParamsModel>, res: Response<VideoViewModel>, next: NextFunction) => {
    const foundVideo = db.videos.find(v => v.id === Number(req.params.id))
    if (!foundVideo) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    const foundindex = db.videos.indexOf(foundVideo!)

    if (foundindex < 0) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    db.videos.splice(foundindex, 1)

    res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
})



export {
    getVideosRouter
}
