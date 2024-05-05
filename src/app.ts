
import express from 'express'

import { getVideosRouter } from './routes/videos'
import { getTestingRouter } from './routes/testing'
import { getBlogsRouter } from './routes/blogs'

export const app = express()

const jsonBody = express.json()
app.use(jsonBody)

export const RouterPaths = {
    videos: '/videos',
    blogs: '/blogs',
    testing: '/testing'
}

app.use(RouterPaths.videos, getVideosRouter())
app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.testing, getTestingRouter())

