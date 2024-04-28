import { RouterPaths, app } from "../app"
import { db } from "../db/db"
import { DBType } from "../types"
import { HTTP_STATUSES } from "../utils"
import express, { Request, Response, NextFunction } from 'express'

const getTestingRouter = express.Router()


getTestingRouter.delete('/all-data', (req: Request, res: Response, next: NextFunction) => {
    db.videos = []
    res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
})


export {
    getTestingRouter
}