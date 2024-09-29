import { LikeModel } from "../features/likes/domain/like.entity"
import { ObjectId } from "mongodb"


export const likesQRepository = {
    async findLike(id: ObjectId) {
        const like = await LikeModel.findOne({ _id: id })
        if (!like) return null
        return like
    },
    async getLikeByAuthorAndParent(authorId: string, parentId: string) {
        const likeData = await LikeModel.findOne({ $and: [{ authorId }, { 'parent.id': parentId }] })
        return likeData
    }
}