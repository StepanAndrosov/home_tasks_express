import express, { NextFunction, Request, Response } from 'express'
import { videosRepository } from "../repositories/videosRepository"
import { HTTP_STATUSES } from "../utils"


export const getTestingRouter = () => {
    const router = express.Router()

    router.delete('/all-data', (req: Request, res: Response, next: NextFunction) => {
        videosRepository.testDeleteData()
        res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
    })


    return router
}

