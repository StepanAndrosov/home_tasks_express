import express, { NextFunction, Request, Response } from 'express'
import { db } from '../db/db'
import { VideoViewModel } from '../features/videos/models/VideoViewModel'
import { DAY, HTTP_STATUSES, availableResolutions, validLengthFields } from '../utils'
import { ErrorsMessagesType, Error, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, Resolution } from '../types'
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

getVideosRouter.post('/', (req: RequestWithBody<VideoCreateModel>, res: Response<VideoViewModel | ErrorsMessagesType>, next: NextFunction) => {

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

    const newVideo = {
        id: Date.now(),
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions as Resolution[],
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(Date.now()).toISOString(),
        publicationDate: new Date(Date.now() + DAY).toISOString(),
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

getVideosRouter.put('/:id', (req: RequestWithParamsAndBody<VideoIdParamsModel, VideoUpdateModel>, res: Response<ErrorsMessagesType>, next: NextFunction) => {
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
