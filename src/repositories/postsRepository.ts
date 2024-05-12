import { v4 } from "uuid";
import { postsCollection } from "../db/db";
import { PostCreateModel } from "../features/posts/models/PostCreateModel";
import { PostModel } from "../features/posts/models/PostModel";
import { PostUpdateModel } from "../features/posts/models/PostUpdateModel";
import { PostViewModel } from "../features/posts/models/PostViewModel";

const getViewModelPost = (post: PostModel): PostViewModel => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsRepository = {
    async testDeleteData() {
        await postsCollection.drop()
    },
    async getPosts() {
        const postsData = await postsCollection.find({}).toArray()
        return postsData.map((p) => getViewModelPost(p))
    },
    async findPost(id: string) {
        const postData = await postsCollection.findOne({ id })
        if (!postData) return null
        return getViewModelPost(postData)
    },
    async createPost(createData: PostCreateModel, blogName: string) {
        const newPost = {
            id: v4(),
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName,
            createdAt: new Date(Date.now()).toISOString()
        }

        await postsCollection.insertOne(newPost)

        return newPost
    },
    async updatePost(id: string, foundPost: PostModel, updateData: PostUpdateModel) {
        const newPost = {
            ...foundPost,
            ...updateData
        }
        await postsCollection.updateOne({ id }, { $set: newPost })
    },
    async deletePost(id: string) {
        await postsCollection.deleteOne({ id })
    }
}