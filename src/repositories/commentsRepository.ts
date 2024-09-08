import { ObjectId } from "mongodb"
import { CreateCommentDto } from "../features/comments/domain/CreateCommentDtos"
import { CommentModel } from "../features/comments/domain/comment.entity"
import { CommentViewModel } from "../features/comments/models/CommentViewModel"
import { ICommentModel } from "../features/comments/models/ICommentModel"

export const getViewModelComment = (comment: ICommentModel): CommentViewModel => {
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

export const commentsRepository = {
    async testDeleteData() {
        await CommentModel.deleteMany({})
    },
    async createComment(createData: CreateCommentDto, commentatorInfo: { userId: string, userLogin: string }) {
        const newComment = CommentModel.createComment(createData, commentatorInfo)

        await newComment.save()

        return getViewModelComment(newComment)
    },

    async updateComment(id: string, content: string) {
        const foundedComment = await CommentModel.findOne({ _id: new ObjectId(id) })

        if (!foundedComment) return false

        foundedComment.content = content

        return true
    },
    async deleteComment(id: string) {
        await CommentModel.deleteOne({ _id: new ObjectId(id) })
    }
}