import { ObjectId } from "mongodb"
import { CommentModel } from "../features/comments/models/CommentModel"
import { CommentViewModel } from "../features/comments/models/CommentViewModel"


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

const getModelComment = (comment: CommentViewModel): CommentModel => {
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