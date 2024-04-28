import type { Request } from "express"
import { VideoModel } from "./features/videos/models/VideoModel"


export type DBType = {
    videos: VideoModel[]

}

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>