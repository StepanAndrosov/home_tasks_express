import { v4 } from "uuid";
import { postsCollection } from "../db/db";
import { PostCreateModel } from "../features/posts/models/PostCreateModel";
import { PostModel } from "../features/posts/models/PostModel";
import { PostUpdateModel } from "../features/posts/models/PostUpdateModel";

export const postsRepository = {
    async testDeleteData() {
        await postsCollection.drop()
    },
    async getPosts() {
        return await postsCollection.find({}).toArray()
    },
    async findPost(id: string) {
        return await postsCollection.findOne({ id })
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