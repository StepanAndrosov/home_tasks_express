import express, { Request, Response } from 'express'
import { app } from '../app'
import { HTTP_STATUSES } from '../utils'
import { DBType } from '../types'
import { VideoViewModel } from '../features/videos/models/VideoViewModel'

export const getVideosRouter = (db: DBType) => {
    const router = express.Router()

    router.get('/', (req: Request, res: Response<VideoViewModel[]>) => {
        res.json(db.videos)
        res.sendStatus(HTTP_STATUSES.OK_200)
    })

    // app.get('/courses/:id', (req: RequestWithParams<CourseIdParamsModel>, res: Response<CourseViewModel>) => {
    //     const foundCourse = db.courses.find(c => c.id === + req.params.id)

    //     if (!foundCourse) {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return
    //     }
    //     res.json({ id: foundCourse.id, title: foundCourse.title })
    //     res.sendStatus(HTTP_STATUSES.OK_200)
    // })

    // app.post('/courses', (req: RequestWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {

    //     if (!req.body.title) {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return
    //     }
    //     const createdCourse = {
    //         id: db.courses.length + 1,
    //         title: req.body.title,
    //         studentsCount: 0
    //     }
    //     db.courses.push(createdCourse)
    //     res.sendStatus(HTTP_STATUSES.CREATED_201)
    //     res.json(createdCourse)
    // })

    // app.delete('/courses/:id', (req: RequestWithParams<CourseIdParamsModel>, res: Response) => {

    //     const findId = db.products.filter((c) => c.id === +req.params.id)[0].id
    //     console.log(findId, 'findId')
    //     if (findId > -1) {
    //         db.courses.splice(findId - 1, 1)
    //         res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
    //     } else {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //         return
    //     }
    // })

    return router
}
