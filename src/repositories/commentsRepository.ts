import { ObjectId } from "mongodb"
import { CreateCommentDto } from "../features/comments/domain/CreateCommentDtos"
import { CommentModel } from "../features/comments/domain/comment.entity"
import { CommentViewModel } from "../features/comments/models/CommentViewModel"
import { ICommentModel } from "../features/comments/models/ICommentModel"
import { LikeStatus } from "../features/likes/models/LikeStatus"

export const getViewModelComment = (comment: ICommentModel): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: comment.likesInfo
    }
}

class CommentsRepository {
    async testDeleteData() {
        await CommentModel.deleteMany({})
    }
    async createComment(createData: CreateCommentDto, commentatorInfo: { userId: string, userLogin: string }) {
        const newComment = CommentModel.createComment(createData, commentatorInfo)

        await newComment.save()

        return getViewModelComment(newComment)
    }

    async updateComment(id: string, content: string) {
        const foundComment = await CommentModel.findOne({ _id: new ObjectId(id) })

        if (!foundComment) return false

        foundComment.content = content

        return true
    }
    async increaseLike(id: string) {
        const foundComment = await CommentModel.findOne({ _id: new ObjectId(id) })
        if (!foundComment) return false
        foundComment.increaseLike()
        await foundComment.save()
        return true
    }
    async decreaseLike(id: string,) {
        const foundComment = await CommentModel.findOne({ _id: new ObjectId(id) })
        if (!foundComment) return false
        foundComment.decreaseLike()
        await foundComment.save()
        return true
    }
    async increaseDislike(id: string,) {
        const foundComment = await CommentModel.findOne({ _id: new ObjectId(id) })
        if (!foundComment) return false
        foundComment.increaseDislike()
        await foundComment.save()
        return true
    }
    async decreaseDislike(id: string,) {
        const foundComment = await CommentModel.findOne({ _id: new ObjectId(id) })
        if (!foundComment) return false
        foundComment.decreaseDislike()
        await foundComment.save()
        return true
    }
    async deleteComment(id: string) {
        await CommentModel.deleteOne({ _id: new ObjectId(id) })
    }
}

export const commentsRepository = new CommentsRepository()