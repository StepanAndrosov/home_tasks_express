import { WithId } from "mongodb"
import { LikeStatus } from "../../likes/models/LikeStatus"
import { LikeParentType } from "./LikeParent"


interface Like {
    createdAt: string
    status: LikeStatus
    authorId: string
    parent: { id: string, type: LikeParentType }
}

export type ILikeModel = WithId<Like>