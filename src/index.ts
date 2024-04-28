import { Request, Response } from 'express'
import { app } from './app'
import { HTTP_STATUSES } from './utils'
import { db } from './db/db'
import { VideoViewModel } from './features/videos/models/VideoViewModel'

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Exsample app litsening on port ${port}`)
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!!')
})




