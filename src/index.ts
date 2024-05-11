import { Request, Response } from 'express'
import { app } from './app'
import { runDB } from './db/db'

const port = process.env.PORT || 3000
app.listen(port, () => {
    runDB()
    console.log(`Exsample app litsening on port ${port}`)
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!!!!')
})




