import { ObjectId } from "mongodb"
import { LikeModel } from "../features/likes/domain/like.entity"
import { ILikeModel } from "../features/likes/models/ILikeModel"


const getViewModelLike = (like: ILikeModel) => {
    return {
        addedAt: like.createdAt,
        userId: like.authorId,
        login: like.authorName
    }
}

export const likesQRepository = {
    async findLike(id: ObjectId) {
        const like = await LikeModel.findOne({ _id: id })
        if (!like) return null
        return like
    },
    async getLikeByAuthorAndParent(authorId: string, parentId: string) {
        const like = await LikeModel.findOne({ $and: [{ authorId }, { 'parent.id': parentId }] })
        if (!like) return null
        return like
    },
    /** get likes by parent only status 'Like' last three */
    async getLikesByParentIdStatusLike(parentId: string) {
        const likes = await LikeModel.find({ $and: [{ 'parent.id': parentId }, { status: 'Like' }] })
            .sort({ createdAt: -1 })
            .limit(3)
        if (!likes) return null
        return likes.map((l) => getViewModelLike(l))
    }
}