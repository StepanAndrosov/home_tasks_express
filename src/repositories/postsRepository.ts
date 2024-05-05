import { db } from "../db/db";
import { PostCreateModel } from "../features/posts/models/PostCreateModel";
import { PostModel } from "../features/posts/models/PostModel";
import { PostUpdateModel } from "../features/posts/models/PostUpdateModel";

export const postsRepository = {
    testDeleteData() {
        db.posts = []
    },
    getPosts() {
        return db.posts
    },
    findPost(id: string) {
        return db.posts.find(v => v.id === id)
    },
    findIndex(post: PostModel) {
        return db.posts.indexOf(post)
    },
    createPost(createData: PostCreateModel, blogName: string) {
        const newPost = {
            id: Date.now().toString(),
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName,
        }

        db.posts.push(newPost)

        return newPost
    },
    updatePost(index: number, foundPost: PostModel, updateData: PostUpdateModel) {
        const newPost = {
            ...foundPost,
            ...updateData
        }
        db.posts.splice(index, 1, newPost)
    },
    deletePost(index: number) {
        db.posts.splice(index, 1)
    }
}