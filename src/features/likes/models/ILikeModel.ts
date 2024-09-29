import { WithId } from "mongodb"
import { LikeStatus } from "../../likes/models/LikeStatus"


interface Like {
    createdAt: string
    status: LikeStatus
    authorId: string
    parentId: string
}

export type ILikeModel = WithId<Like>