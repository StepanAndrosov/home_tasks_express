
import { NextFunction, Request, Response } from "express"
import { customRatesQRepository } from "../queryRepositories/customRatesQRepository"
import { HTTP_STATUSES } from "../utils/helpers"
import { customRateRepository } from "../repositories/customRateRepository"

export const customRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string
    const url = req.baseUrl + req.path || req.originalUrl + req.path

    await customRateRepository.createCustomRate({ ip, url })

    const customRate = await customRatesQRepository.getCustomRates({ ip, url })

    if (customRate && customRate.length) {
        // custom rate in the last 10 sec
        console.log(url, 'url')
        const foundedCustomRate = customRate.filter((cr) => new Date(cr.date).getTime() >= (Date.now() - (10 * 1000)))

        console.log(foundedCustomRate.map((cr) => new Date(cr.date).getTime()), 'times', Date.now(), 'now', Date.now() - (10 * 1000), 'now - 10sec')
        // if custom rate exceeds five in the last 10 sec
        if (foundedCustomRate.length > 5) {
            res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS)
            return
        }
    }

    next()
}

