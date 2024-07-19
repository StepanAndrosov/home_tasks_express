import { ObjectId } from "mongodb"
import { commentsCollection } from "../db/db"
import { getViewModelComment } from "../repositories/commentsRepository"
import { SanitizedQuery } from "../utils/helpers"

export const commentsQRepository = {
    async getComments(query: SanitizedQuery) {

        const skip = (query.pageNumber - 1) * query.pageSize

        const commentsData = await commentsCollection.find({})
            .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)
            .toArray()


        const totalCount = await commentsCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / query.pageSize)


        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: commentsData.map((c) => getViewModelComment(c))
        }
    },
    async findComment(id: string) {
        const commentData = await commentsCollection.findOne({ _id: new ObjectId(id) })
        if (!commentData) return null
        return getViewModelComment(commentData)
    },
}