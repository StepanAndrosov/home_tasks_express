
import express from 'express'

import { getVideosRouter } from './routes/videos'
import { getTestingRouter } from './routes/testing'
import { getBlogsRouter } from './routes/blogs'
import { getPostsRouter } from './routes/posts'

export const app = express()

const jsonBody = express.json()
app.use(jsonBody)

export const RouterPaths = {
    videos: '/videos',
    blogs: '/blogs',
    posts: '/posts',
    testing: '/testing'
}

app.use(RouterPaths.videos, getVideosRouter())
app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.testing, getTestingRouter())

