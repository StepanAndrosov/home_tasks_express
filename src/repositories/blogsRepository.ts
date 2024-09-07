import { ObjectId } from "mongodb";
import { BlogViewModel } from "../features/blogs/models/BlogViewModel";
import { IBlogModel } from "../features/blogs/models/IBlogModel";
import { getViewModelPost } from "./postsRepository";
import { CreatePostDto, PostModel } from "../features/posts/domain";
import { CreateBlogDto, UpdateBlogDto, BlogModel } from "../features/blogs/domain";

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

export const blogsRepository = {
    async testDeleteData() {
        // await blogsCollection.drop()
    },
    async createBlog(createData: CreateBlogDto) {
        const newBlog = BlogModel.createBlog(createData)

        await newBlog.save()

        return getViewModelBlog(newBlog)
    },
    async createBlogIdPosts(dto: CreatePostDto, blogId: string, blogName: string) {
        const newPost = PostModel.createPost(dto, blogId, blogName)

        await newPost.save()

        return getViewModelPost(newPost)
    },
    async updateBlog(id: string, updateData: UpdateBlogDto) {
        const foundBlogModel = await BlogModel.findOne({ _id: new ObjectId(id) })

        if (!foundBlogModel) return false

        foundBlogModel.name = updateData.name
        foundBlogModel.description = updateData.description
        foundBlogModel.websiteUrl = updateData.websiteUrl

        await foundBlogModel.save()

        return true
    },
    async deleteBlog(id: string) {
        await BlogModel.deleteOne({ _id: new ObjectId(id) })
    }
}