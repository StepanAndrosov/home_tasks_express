import { ObjectId } from "mongodb";
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { IPostModel } from '../models/IPostModel';
import { CreatePostDto } from './CreatePostDto';

type PostMethods = typeof postMethods;
type PostStatics = typeof postStatics;

type PostModelType = Model<IPostModel, {}, PostMethods> & PostStatics;

export type PostDocument = HydratedDocument<IPostModel, PostMethods>;

const NewLike = new mongoose.Schema({
    addedAt: { type: String, require: true },
    userId: { type: String, require: true },
    login: { type: String, require: true },
});

export const PostSchema = new mongoose.Schema<IPostModel, PostModelType, PostMethods>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String },
    extendedLikesInfo: {
        likesCount: { type: Number, require: true },
        dislikesCount: { type: Number, require: true },
        myStatus: { type: String, require: true },
        newestLikes: { type: [NewLike], default: [] }
    }
})

const postMethods = {
    increaseLike() {
        const comment = this as PostDocument
        comment.extendedLikesInfo.likesCount++
        console.log(comment.extendedLikesInfo.likesCount, 'increaseLike')
    },
    decreaseLike() {
        const comment = this as PostDocument
        if (!!comment.extendedLikesInfo.likesCount)
            comment.extendedLikesInfo.likesCount--
        console.log(comment.extendedLikesInfo.likesCount, 'decreaseLike')
    },
    increaseDislike() {
        const comment = this as PostDocument
        comment.extendedLikesInfo.dislikesCount++
        console.log(comment.extendedLikesInfo.dislikesCount, 'increaseDislike')
    },
    decreaseDislike() {
        const comment = this as PostDocument
        if (!!comment.extendedLikesInfo.dislikesCount)
            comment.extendedLikesInfo.dislikesCount--
        console.log(comment.extendedLikesInfo.dislikesCount, 'decreaseDislike')
    },
}

const postStatics = {
    createPost(dto: CreatePostDto, blogId: string, blogName: string) {
        const newPost = new PostModel()
        newPost._id = new ObjectId()
        newPost.title = dto.title
        newPost.shortDescription = dto.shortDescription
        newPost.content = dto.content
        newPost.blogId = blogId
        newPost.blogName = blogName
        newPost.createdAt = new Date(Date.now()).toISOString()
        newPost.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: []
        }

        return newPost;
    },
};
PostSchema.methods = postMethods;
PostSchema.statics = postStatics;

export const PostModel = mongoose.model<IPostModel, PostModelType>('post', PostSchema)
