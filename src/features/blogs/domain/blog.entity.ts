import mongoose, { HydratedDocument, Model } from 'mongoose'
import { ObjectId } from "mongodb";
import { IBlogModel } from '../models/IBlogModel'
import { CreateBlogDto } from './';

type BlogMethods = typeof blogMethods;
type BlogStatics = typeof blogStatics;

type BlogModelType = Model<IBlogModel, {}, BlogMethods> & BlogStatics;

export type BlogDocument = HydratedDocument<IBlogModel, BlogMethods>;

export const BlogSchema = new mongoose.Schema<IBlogModel, BlogModelType, BlogMethods>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String },
    isMembership: { type: Boolean }
})

const blogMethods = {}

const blogStatics = {
    createBlog(dto: CreateBlogDto) {
        const newBlog = new BlogModel()
        newBlog._id = new ObjectId()
        newBlog.name = dto.name
        newBlog.description = dto.description
        newBlog.websiteUrl = dto.websiteUrl
        newBlog.createdAt = new Date(Date.now()).toISOString()
        newBlog.isMembership = false

        return newBlog;
    },
};

BlogSchema.statics = blogStatics;

export const BlogModel = mongoose.model<IBlogModel, BlogModelType>('blog', BlogSchema)
