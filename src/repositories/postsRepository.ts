import { v4 } from "uuid";
import { postsCollection } from "../db/db";
import { PostCreateModel } from "../features/posts/models/PostCreateModel";
import { PostModel } from "../features/posts/models/PostModel";
import { PostUpdateModel } from "../features/posts/models/PostUpdateModel";
import { PostViewModel } from "../features/posts/models/PostViewModel";
import { ObjectId, WithId } from "mongodb";

export const getViewModelPost = (post: PostModel): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

const getModelPost = (post: PostViewModel): PostModel => {
    return {
        _id: new ObjectId(post.id),
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

    async createPost(createData: PostCreateModel, blogName: string) {
        const newPost = {
            _id: new ObjectId(),
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName,
            createdAt: new Date(Date.now()).toISOString()
        }

        await postsCollection.insertOne(newPost)

        return getViewModelPost(newPost)
    },
    async updatePost(foundPost: PostViewModel, updateData: PostUpdateModel) {

        const foundModelPost = getModelPost(foundPost)

        const newPost = {
            ...foundModelPost,
            ...updateData
        }
        await postsCollection.updateOne({ _id: foundModelPost._id }, { $set: newPost })
    },
    async deletePost(id: string) {
        await postsCollection.deleteOne({ _id: new ObjectId(id) })
    }
}