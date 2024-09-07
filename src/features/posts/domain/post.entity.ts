import mongoose, { HydratedDocument, Model } from 'mongoose'
import { CreatePostDto } from './createPostDto';
import { ObjectId } from "mongodb";
import { IPostModel } from '../models/IPostModel';

type PostMethods = typeof postMethods;
type PostStatics = typeof postStatics;

type PostModelType = Model<IPostModel, {}, PostMethods> & PostStatics;

export type PostDocument = HydratedDocument<IPostModel, PostMethods>;

export const PostSchema = new mongoose.Schema<IPostModel, PostModelType, PostMethods>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String }
})

const postMethods = {}

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

        return newPost;
    },
};
PostSchema.methods = postMethods;
PostSchema.statics = postStatics;

export const PostModel = mongoose.model<IPostModel, PostModelType>('post', PostSchema)
