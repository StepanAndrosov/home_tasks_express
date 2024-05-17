import { Collection, MongoClient } from "mongodb";
import { DBType } from "../types";

import { VideoModel } from "../features/videos/models/VideoModel";
import { BlogModel } from "../features/blogs/models/BlogModel";
import { PostModel } from "../features/posts/models/PostModel";



let client = {} as MongoClient

export let videosCollection = {} as Collection<VideoModel>
export let blogsCollection = {} as Collection<BlogModel>
export let postsCollection = {} as Collection<PostModel>

export const runDB = async (MONGO_URL: string) => {
    try {
        client = new MongoClient(MONGO_URL)

        videosCollection = client.db().collection<VideoModel>('videos')
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

export const db: DBType = {
    videos: [
        {
            id: 0,
            title: 'Start Video',
            author: 'Ivan',
            canBeDownloaded: true,
            minAgeRestriction: 6,
            createdAt: '2024-04-28T04:26:10.752Z',
            publicationDate: '2024-04-28T04:26:10.752Z',
            availableResolutions: ['P144']
        },
        {
            id: 1,
            title: 'Next Video',
            author: 'Ivan',
            canBeDownloaded: true,
            minAgeRestriction: 6,
            createdAt: '2024-04-28T04:26:10.752Z',
            publicationDate: '2024-04-28T04:26:10.752Z',
            availableResolutions: ['P240']
        }
    ],
    blogs: [
        {
            id: '1',
            name: 'it-boroda',
            description: 'The creat it podcast',
            websiteUrl: 'https://it-boroda.com',
            createdAt: '2024-04-28T04:26:10.752Z',
            isMembership: false
        },
        {
            id: '2',
            name: 'we are doomed',
            description: 'The creat it podcast with some humor',
            websiteUrl: 'https://wearedoomed.com',
            createdAt: '2024-04-28T04:26:10.752Z',
            isMembership: false
        },
    ],
    posts: [
        {
            id: '1',
            title: 'Interview 1',
            shortDescription: 'Interview with yandex founder',
            blogId: '1',
            blogName: 'it-boroda',
            content: 'it podcasts',
            createdAt: '2024-04-28T04:26:10.752Z',
        },
        {
            id: '2',
            title: 'Interview 1',
            shortDescription: 'Interview with yandex founder',
            blogId: '2',
            blogName: 'we are doomed',
            content: 'it podcasts',
            createdAt: '2024-04-28T04:26:10.752Z',
        },
    ]
}