import { Collection, MongoClient } from "mongodb";

import { BlogModel } from "../features/blogs/models/BlogModel";
import { PostModel } from "../features/posts/models/PostModel";
import { UserModel } from "../features/users/models/UserModel";
import { CommentModel } from "../features/comments/models/CommentModel";
import { AccessTokenModel } from "../features/auth/models/AccessTokenModel";

let client = {} as MongoClient

export let blogsCollection = {} as Collection<BlogModel>
export let postsCollection = {} as Collection<PostModel>
export let usersCollection = {} as Collection<UserModel>
export let commentsCollection = {} as Collection<CommentModel>
export let blackTokensCollection = {} as Collection<AccessTokenModel>

export const db = {
    client: {} as MongoClient,

    async run(MONGO_URL: string) {
        try {
            client = new MongoClient(MONGO_URL)

            blogsCollection = client.db().collection<BlogModel>('blogs')
            postsCollection = client.db().collection<PostModel>('posts')
            usersCollection = client.db().collection<UserModel>('users')
            commentsCollection = client.db().collection<CommentModel>('comments')
            blackTokensCollection = client.db().collection<AccessTokenModel>('black-tokens')

            await client.connect()
            console.log('✅ Connected successfully to server')
            return true
        } catch (e) {
            console.log('❌ Unsuccessfully connected to server')
            await client.close()
            return false
        }
    },
    async stop() {
        await client.close()
        console.log('✅ Connection successfully closed')
    }
}