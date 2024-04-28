
import express, { Request, Response } from 'express'

import { db } from './db/db'
import { getVideosRouter } from './routes/videos'
import { getTestRouter } from './routes/testing'

const router = require('./routes');

export const app = express()


const jsonBody = express.json()
app.use(jsonBody)

export const RouterPaths = {
    videos: 'videos',
    testing: 'testing'
}

app.use(RouterPaths.videos, getVideosRouter(db))

app.use(RouterPaths.testing, getTestRouter(db))

