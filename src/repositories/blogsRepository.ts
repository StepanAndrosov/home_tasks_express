import { ObjectId } from "mongodb";
import { blogsCollection, postsCollection } from "../db/db";
import { BlogCreateModel } from "../features/blogs/models/BlogCreateModel";
import { BlogModel } from "../features/blogs/models/BlogModel";
import { BlogUpdateModel } from "../features/blogs/models/BlogUpdateModel";
import { BlogViewModel } from "../features/blogs/models/BlogViewModel";
import { BlogIdPostCreateModel } from "../features/blogs/models/BlogIdPostCreateModel";
import { getViewModelPost } from "./postsRepository";


export const getViewModelBlog = (blog: BlogModel): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

const getModelBlog = (blog: BlogViewModel): BlogModel => {
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
    async createBlogIdPosts(blogId: string, body: BlogIdPostCreateModel, blogName: string) {
        const newPost = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
            blogName,
            createdAt: new Date(Date.now()).toISOString()
        }

        await postsCollection.insertOne(newPost)

        return getViewModelPost(newPost)
    },
    async updateBlog(foundBlog: BlogViewModel, updateData: BlogUpdateModel) {

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