import mongoose from 'mongoose'
import { IBlogModel } from '../models/IBlogModel'

export const BlogSchema = new mongoose.Schema<IBlogModel>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String },
    isMembership: { type: Boolean }
})
export const BlogModel = mongoose.model<IBlogModel>('blogs', BlogSchema)