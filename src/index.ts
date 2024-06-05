import { Request, Response } from 'express'
import { app } from './app'
import { runDB } from './db/db'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log(process.env.MONGO_URL);

(async () => {
    if (!await runDB(mongoURI)) {
        console.log()
        process.exit(1)
    }
    app.listen(port, () => {
        console.log(`Exsample app litsening on port ${port}`)
    })

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello World!!!!')
    })
})()





