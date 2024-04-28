import { RouterPaths, app } from "../app"
import { DBType } from "../types"
import { HTTP_STATUSES } from "../utils"


export const getTestRouter = (db: DBType) => {
    return app.delete(RouterPaths.__test__, (req: any, res: any) => {
        db.courses = []
        db.users = []
        res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
    })
}