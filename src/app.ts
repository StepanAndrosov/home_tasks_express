
import express from 'express'

import { getTestingRouter } from './routes/testing'
import { getBlogsRouter } from './routes/blogs'
import { getPostsRouter } from './routes/posts'

export const app = express()

const jsonBody = express.json()
app.use(jsonBody)

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    testing: '/testing'
}

app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.testing, getTestingRouter())

