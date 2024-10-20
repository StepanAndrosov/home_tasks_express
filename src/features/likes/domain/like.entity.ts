import mongoose, { HydratedDocument, Model } from 'mongoose';
import { ILikeModel } from '../models/ILikeModel';
import { ObjectId } from "mongodb"
import { CreateLikeDto } from './CreateLikeDto';
import { LikeStatus } from '../models/LikeStatus';

type LikeMethods = typeof likeMethods;
type LikeStatics = typeof likeStatics;

type LikeModelType = Model<ILikeModel, {}, LikeMethods> & LikeStatics;

export type LikeDocument = HydratedDocument<ILikeModel, LikeMethods>;

export const LikeSchema = new mongoose.Schema<ILikeModel, LikeModelType, LikeMethods>({
    createdAt: { type: String, required: true },
    status: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    parent: { id: { type: String, required: true }, type: { type: String, required: true } },
})

const likeMethods = {
    updateLike(status: LikeStatus) {
        const like = this as LikeDocument
        like.status = status
        like.createdAt = new Date(Date.now()).toISOString()
    },
}

const likeStatics = {
    createLike(dto: CreateLikeDto) {
        const newLike = new LikeModel()
        newLike._id = new ObjectId()
        newLike.createdAt = new Date(Date.now()).toISOString()
        newLike.status = dto.status
        newLike.authorId = dto.authorId
        newLike.authorName = dto.authorName
        newLike.parent = dto.parent

        return newLike
    },
};

LikeSchema.statics = likeStatics;
LikeSchema.methods = likeMethods;

export const LikeModel = mongoose.model<ILikeModel, LikeModelType>('like', LikeSchema)