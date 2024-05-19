import { v4 } from "uuid";
import { blogsCollection } from "../db/db";
import { BlogCreateModel } from "../features/blogs/models/BlogCreateModel";
import { BlogModel } from "../features/blogs/models/BlogModel";
import { BlogUpdateModel } from "../features/blogs/models/BlogUpdateModel";
import { BlogViewModel } from "../features/blogs/models/BlogViewModel";
import { ObjectId, WithId } from "mongodb";


const getViewModelBlog = (blog: WithId<BlogModel>): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

const getModelBlog = (blog: BlogViewModel): WithId<BlogModel> => {
    return {
        _id: new ObjectId(blog.id),
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
            _id: new ObjectId(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date(Date.now()).toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog)

        return getViewModelBlog(newBlog)
    },
    async updateBlog(id: string, foundBlog: BlogViewModel, updateData: BlogUpdateModel) {

        const foundBlogModel = getModelBlog(foundBlog)

        const newBlog = {
            ...foundBlogModel,
            ...updateData
        }
        await blogsCollection.updateOne({ _id: foundBlogModel._id }, { $set: newBlog })
    },
    async deleteBlog(id: string) {
        await blogsCollection.deleteOne({ _id: new ObjectId(id) })
    }
}