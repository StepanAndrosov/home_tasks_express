
import express from 'express'

import { getVideosRouter } from './routes/videos'
import { getTestingRouter } from './routes/testing'
import { db } from './db/db'

export const app = express()

const jsonBody = express.json()
app.use(jsonBody)

export const RouterPaths = {
    videos: '/videos',
    testing: '/testing'
}

app.use(RouterPaths.videos, getVideosRouter())
app.use(RouterPaths.testing, getTestingRouter())

