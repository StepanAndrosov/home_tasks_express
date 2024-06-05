
import express from 'express'

import { getTestingRouter } from './routes/testing'
import { getBlogsRouter } from './routes/blogs'
import { getPostsRouter } from './routes/posts'
import { getUsersRouter } from './routes/users'
import { getAuthRouter } from './routes/login'

export const app = express()

const jsonBody = express.json()
app.use(jsonBody)

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    auth: '/auth',
    testing: '/testing'
}

app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.users, getUsersRouter())
app.use(RouterPaths.auth, getAuthRouter())
app.use(RouterPaths.testing, getTestingRouter())

