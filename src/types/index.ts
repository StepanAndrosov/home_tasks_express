import type { Request } from "express"

export type Error = {
    message: string,
    field: string
}
export type ErrorsMessagesType = {
    errorsMessages: Error[]
}

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>
export type RequestWithParamsAndQuery<T, Q> = Request<T, {}, {}, Q>

export type ResponsePaginate<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}
export type ResultStatus = 'Success' | 'NotFound' | 'Forbidden' | 'Unauthorized' | 'BadRequest'

export type Result<T> = {
    status: ResultStatus
    errorMessages?: [{ field: string, message: string }]
    data?: T
}