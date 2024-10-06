import { ObjectId } from "mongodb"
import { getViewModelComment } from "../repositories/commentsRepository"
import { CommentModel } from "../features/comments/domain/comment.entity"

export const commentsQRepository = {
    async findComment(id: string) {
        const commentData = await CommentModel.findOne({ _id: new ObjectId(id) })
        if (!commentData) return null
        return getViewModelComment(commentData)
    },
}