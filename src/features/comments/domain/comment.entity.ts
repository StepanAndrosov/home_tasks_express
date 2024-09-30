import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { ICommentModel } from '../models/ICommentModel';
import { CreateCommentDto } from './CreateCommentDtos';
import { LikeStatus } from "../../likes/models/LikeStatus";

type CommentMethods = typeof commentMethods;
type CommentStatics = typeof commentStatics;

type CommentModelType = Model<ICommentModel, {}, CommentMethods> & CommentStatics;

export type CommentDocument = HydratedDocument<ICommentModel, CommentMethods>;

export const CommentSchema = new mongoose.Schema<ICommentModel, CommentModelType, CommentMethods>({
    content: { type: String, required: true },
    postId: { type: String, required: true },
    createdAt: { type: String, required: true },
    commentatorInfo: { userId: { type: String, required: true }, userLogin: { type: String, required: true } },
    likesInfo: {
        likesCount: { type: Number, required: true },
        dislikesCount: { type: Number, required: true },
        myStatus: { type: String, required: true },
    }
})

const commentMethods = {
    increaseLike() {
        const comment = this as CommentDocument
        comment.likesInfo.likesCount++
        console.log(comment.likesInfo.likesCount, 'increaseLike')
    },
    decreaseLike() {
        const comment = this as CommentDocument
        if (!!comment.likesInfo.likesCount)
            comment.likesInfo.likesCount--
        console.log(comment.likesInfo.likesCount, 'decreaseLike')
    },
    increaseDislike() {
        const comment = this as CommentDocument
        comment.likesInfo.dislikesCount++
        console.log(comment.likesInfo.dislikesCount, 'increaseDislike')
    },
    decreaseDislike() {
        const comment = this as CommentDocument
        if (!!comment.likesInfo.dislikesCount)
            comment.likesInfo.dislikesCount--
        console.log(comment.likesInfo.dislikesCount, 'decreaseDislike')
    },
}

const commentStatics = {
    createComment(dto: CreateCommentDto, commentatorInfo: { userId: string, userLogin: string }) {
        const newComment = new CommentModel()
        newComment._id = new ObjectId()
        newComment.content = dto.content
        newComment.commentatorInfo = commentatorInfo
        newComment.createdAt = new Date(Date.now()).toISOString()
        newComment.postId = dto.postId
        newComment.likesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None'
        }

        return newComment;
    },
};

CommentSchema.statics = commentStatics;
CommentSchema.methods = commentMethods;

export const CommentModel = mongoose.model<ICommentModel, CommentModelType>('comment', CommentSchema)