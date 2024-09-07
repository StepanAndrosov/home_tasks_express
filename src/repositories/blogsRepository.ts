import { ObjectId } from "mongodb";
import { blogsCollection, postsCollection } from "../db/db";
import { BlogCreateModel } from "../features/blogs/models/BlogCreateModel";
import { IBlogModel } from "../features/blogs/models/IBlogModel";
import { BlogUpdateModel } from "../features/blogs/models/BlogUpdateModel";
import { BlogViewModel } from "../features/blogs/models/BlogViewModel";
import { BlogIdPostCreateModel } from "../features/blogs/models/BlogIdPostCreateModel";
import { getViewModelPost } from "./postsRepository";
import { BlogModel } from "../features/blogs/domain/blog.entity";
import { CreateBlogDto } from "../features/blogs/domain/createBlogDto";
import { UpdateBlogDto } from "../features/blogs/domain/updateBlogDto";


export const getViewModelBlog = (blog: IBlogModel): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

const getModelBlog = (blog: BlogViewModel): IBlogModel => {
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
    async createBlog(createData: CreateBlogDto) {
        const newBlog = BlogModel.createBlog(createData)

        await newBlog.save()

        return getViewModelBlog(newBlog)
    },
    async createBlogIdPosts(blogId: string, body: BlogIdPostCreateModel, blogName: string) {
        const newPost = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId,
            blogName,
            createdAt: new Date(Date.now()).toISOString()
        }

        await postsCollection.insertOne(newPost)

        return getViewModelPost(newPost)
    },
    async updateBlog(id: string, updateData: UpdateBlogDto) {
        const foundBlogModel = await BlogModel.findOne({ _id: new ObjectId(id) })

        foundBlogModel!.name = updateData.name
        foundBlogModel!.description = updateData.description
        foundBlogModel!.websiteUrl = updateData.websiteUrl

        await foundBlogModel?.save()

    },
    async deleteBlog(id: string) {
        await blogsCollection.deleteOne({ _id: new ObjectId(id) })
    }
}