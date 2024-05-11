import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HTTP_STATUSES } from "../utils";

export const inputValidMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errorsData = validationResult(req)
    if (!errorsData.isEmpty()) {
        const errors = errorsData.array({ onlyFirstError: true })
            .map(err => ({
                message: err.msg,
                field: (err as any).path
            }))

        res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
            errorsMessages: errors
        })
        return
    } else next()
}