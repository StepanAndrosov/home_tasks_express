import type { Request } from "express"
import { VideoModel } from "./features/videos/models/VideoModel"
import { VideoUpdateModel } from './features/videos/models/VideoUpdateModel';


export type DBType = {
    videos: VideoModel[]
}

export type Resolution = 'P144' | 'P240' | 'P360' | 'P480' | 'P720' | 'P1080' | 'P1440' | 'P2160'

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

