import express, { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from "../utils/helpers"
import { blogsRepository } from '../repositories/blogsRepository'
import { postsRepository } from '../repositories/postsRepository'
import { usersRepository } from '../repositories/usersRepository'
import { commentsRepository } from '../repositories/commentsRepository'
import { deviceRepository } from '../repositories/devicesRepository'


export const getTestingRouter = () => {
    const router = express.Router()

    router.delete('/all-data', async (req: Request, res: Response, next: NextFunction) => {
        await blogsRepository.testDeleteData()
        await postsRepository.testDeleteData()
        await usersRepository.testDeleteData()
        await commentsRepository.testDeleteData()
        await deviceRepository.testDeleteData()
        res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
    })


    return router
}

