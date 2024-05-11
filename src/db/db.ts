import { MongoClient } from "mongodb";
import { DBType } from "../types";
import dotenv from 'dotenv'
import { VideoModel } from "../features/videos/models/VideoModel";
import { BlogModel } from "../features/blogs/models/BlogModel";
import { PostModel } from "../features/posts/models/PostModel";

dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoURI)

const videosDB = client.db('videos')
const blogsTubeDB = client.db('blogsTybe')

export const videosCollection = videosDB.collection<VideoModel>('videos')
export const blogsCollection = blogsTubeDB.collection<BlogModel>('blogs')
export const postsCollection = blogsTubeDB.collection<PostModel>('posts')

export const runDB = async () => {
    try {
        await client.connect()
        console.log('Connected successfully to server')
    } catch (e) {
        console.log('Unsuccessfully connected to server')
        await client.close()
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
            websiteUrl: 'https://it-boroda.com'
        },
        {
            id: '2',
            name: 'we are doomed',
            description: 'The creat it podcast with some humor',
            websiteUrl: 'https://wearedoomed.com'
        },
    ],
    posts: [
        {
            id: '1',
            title: 'Interview 1',
            shortDescription: 'Interview with yandex founder',
            blogId: '1',
            blogName: 'it-boroda',
            content: 'it podcasts'
        },
        {
            id: '2',
            title: 'Interview 1',
            shortDescription: 'Interview with yandex founder',
            blogId: '2',
            blogName: 'we are doomed',
            content: 'it podcasts'
        },
    ]
}