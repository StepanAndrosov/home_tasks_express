import mongoose, { HydratedDocument, Model } from 'mongoose';
import { ILikeModel } from '../models/ILikeModel';
import { ObjectId } from "mongodb"
import { CreateLikeDto } from './CreateLikeDto';

type LikeMethods = typeof likeMethods;
type LikeStatics = typeof likeStatics;

type LikeModelType = Model<ILikeModel, {}, LikeMethods> & LikeStatics;

export type LikeDocument = HydratedDocument<ILikeModel, LikeMethods>;

export const LikeSchema = new mongoose.Schema<ILikeModel, LikeModelType, LikeMethods>({
    createdAt: { type: String, required: true },
    status: { type: String, required: true },
    authorId: { type: String, required: true },
    parentId: { type: String, required: true },
})

const likeMethods = {}

const likeStatics = {
    createLike(dto: CreateLikeDto) {
        const newLike = new LikeModel()
        newLike._id = new ObjectId()
        newLike.createdAt = new Date(Date.now()).toISOString()
        newLike.status = dto.status
        newLike.authorId = dto.authorId
        newLike.parentId = dto.parentId

        return newLike
    },
};

LikeSchema.statics = likeStatics;
LikeSchema.methods = likeMethods;

export const LikeModel = mongoose.model<ILikeModel, LikeModelType>('like', LikeSchema)