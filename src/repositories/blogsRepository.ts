import { v4 } from "uuid";
import { blogsCollection } from "../db/db";
import { BlogCreateModel } from "../features/blogs/models/BlogCreateModel";
import { BlogModel } from "../features/blogs/models/BlogModel";
import { BlogUpdateModel } from "../features/blogs/models/BlogUpdateModel";

export const blogsRepository = {
    async testDeleteData() {
        await blogsCollection.drop()
    },
    async getBlogs() {
        return await blogsCollection.find({}).toArray()
    },
    async findBlog(id: string) {
        return await blogsCollection.findOne({ id })
    },
    async createBlog(createData: BlogCreateModel) {
        const newBlog = {
            id: v4(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date(Date.now()).toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)

        return newBlog
    },
    async updateBlog(id: string, foundBlog: BlogModel, updateData: BlogUpdateModel) {
        const newBlog = {
            ...foundBlog,
            ...updateData
        }
        await blogsCollection.updateOne({ id }, { $set: newBlog })
    },
    async deleteBlog(id: string) {
        await blogsCollection.deleteOne({ id })
    }
}