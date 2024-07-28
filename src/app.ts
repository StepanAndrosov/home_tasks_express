
import express from 'express'

import { getTestingRouter } from './routes/testing'
import { getBlogsRouter } from './routes/blogs'
import { getPostsRouter } from './routes/posts'
import { getUsersRouter } from './routes/users'
import { getAuthRouter } from './routes/auth'
import { getCommentsRouter } from './routes/comments';
import cookieParser from 'cookie-parser'

export const app = express()

const jsonBody = express.json()
app.use(jsonBody)
app.use(cookieParser())
app.set('trust proxy', true)

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    comments: '/comments',
    auth: '/auth',
    security: '/security',
    testing: '/testing'
}

app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.users, getUsersRouter())
app.use(RouterPaths.comments, getCommentsRouter())
app.use(RouterPaths.auth, getAuthRouter())
app.use(RouterPaths.testing, getTestingRouter())

