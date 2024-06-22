import { ObjectId } from "mongodb"
import { CommentModel } from "../features/comments/models/CommentModel"
import { CommentViewModel } from "../features/comments/models/CommentViewModel"
import { commentsCollection } from "../db/db"
import { CommentCreateModel } from "../features/comments/models/CommentCreateModel"
import { CommentUpdateModel } from "../features/comments/models/CommentUpdateModel"

export const getViewModelComment = (comment: CommentModel): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
    }
}

const getModelComment = (comment: CommentViewModel) => {
    return {
        _id: new ObjectId(comment.id),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
    }
}

export const commentsRepository = {
    async testDeleteData() {
        await commentsCollection.drop()
    },
    async createComment(createData: CommentCreateModel, commentatorInfo: { userId: string, userLogin: string }) {
        const newComment = {
            _id: new ObjectId(),
            content: createData.content,
            commentatorInfo: commentatorInfo,
            createdAt: new Date(Date.now()).toISOString(),
            postId: createData.postId
        }

        await commentsCollection.insertOne(newComment)

        return getViewModelComment(newComment)
    },

    async updateComment(foundComment: CommentViewModel, updateData: CommentUpdateModel) {

        const foundBlogModel = getModelComment(foundComment)

        const newComment = {
            ...foundBlogModel,
            ...updateData
        }
        await commentsCollection.updateOne({ _id: foundBlogModel._id }, { $set: newComment })
    },
    async deleteComment(id: string) {
        await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    }
}