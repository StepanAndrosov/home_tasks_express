import { Collection, MongoClient } from "mongodb";
import mongoose from 'mongoose'

import { IBlogModel } from "../features/blogs/models/IBlogModel";
import { IPostModel } from "../features/posts/models/IPostModel";
import { UserModel } from "../features/users/models/UserModel";
import { CommentModel } from "../features/comments/models/CommentModel";
import { AccessTokenModel } from "../features/auth/models/AccessTokenModel";
import { DeviceModel } from "../features/security/models/DeviceModel";
import { CustomRateModel } from "../features/security/models/CustomRateModel";

let client = {} as MongoClient

export let blogsCollection = {} as Collection<IBlogModel>
export let postsCollection = {} as Collection<IPostModel>
export let usersCollection = {} as Collection<UserModel>
export let commentsCollection = {} as Collection<CommentModel>
export let blackTokensCollection = {} as Collection<AccessTokenModel>
export let devicesCollection = {} as Collection<DeviceModel>
export let customRateCollection = {} as Collection<CustomRateModel>

export const db = {
    client: {} as MongoClient,

    async run(MONGO_URL: string) {
        try {
            await mongoose.connect(MONGO_URL)
            console.log('✅ It is ok')

            // ==========================================================
            client = new MongoClient(MONGO_URL)

            blogsCollection = client.db().collection<IBlogModel>('blogs')
            postsCollection = client.db().collection<IPostModel>('posts')
            usersCollection = client.db().collection<UserModel>('users')
            commentsCollection = client.db().collection<CommentModel>('comments')
            blackTokensCollection = client.db().collection<AccessTokenModel>('black-tokens')
            devicesCollection = client.db().collection<DeviceModel>('devices')
            customRateCollection = client.db().collection<CustomRateModel>('custom-rate')

            await client.connect()
            console.log('✅ Connected successfully to server')
            return true
        } catch (e) {
            console.log('❌ Unsuccessfully connected to server')
            await client.close()

            console.log('❌  No connection')
            await mongoose.disconnect()
            return false
        }
    },
    async stop() {
        await client.close()
        console.log('✅ Connection successfully closed')
    }
}