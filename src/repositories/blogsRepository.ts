import { v4 } from "uuid";
import { blogsCollection } from "../db/db";
import { BlogCreateModel } from "../features/blogs/models/BlogCreateModel";
import { BlogModel } from "../features/blogs/models/BlogModel";
import { BlogUpdateModel } from "../features/blogs/models/BlogUpdateModel";
import { BlogViewModel } from "../features/blogs/models/BlogViewModel";


const getViewModelBlog = (blog: BlogModel): BlogViewModel => {
    return {
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

export const blogsRepository = {
    async testDeleteData() {
        await blogsCollection.drop()
    },
    async getBlogs() {
        const blogsData = await blogsCollection.find({}).toArray()
        console.log(blogsData, 'blogsData')
        return blogsData.map((b) => getViewModelBlog(b))
    },
    async findBlog(id: string) {
        const blogData = await blogsCollection.findOne({ id })
        if (!blogData) return null
        return getViewModelBlog(blogData)
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