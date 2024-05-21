import { Collection, MongoClient } from "mongodb";

import { BlogModel } from "../features/blogs/models/BlogModel";
import { PostModel } from "../features/posts/models/PostModel";



let client = {} as MongoClient

export let blogsCollection = {} as Collection<BlogModel>
export let postsCollection = {} as Collection<PostModel>

export const runDB = async (MONGO_URL: string) => {
    try {
        client = new MongoClient(MONGO_URL)

        blogsCollection = client.db().collection<BlogModel>('blogs')
        postsCollection = client.db().collection<PostModel>('posts')

        await client.connect()
        console.log('✅ Connected successfully to server')
        return true
    } catch (e) {
        console.log('❌ Unsuccessfully connected to server')
        await client.close()
        return false
    }
}