import { ObjectId } from "mongodb"
import { getViewModelComment } from "../repositories/commentsRepository"
import { SanitizedQuery } from "../utils/helpers"
import { CommentModel } from "../features/comments/domain/comment.entity"

export const commentsQRepository = {
    async getComments(query: SanitizedQuery) {

        const skip = (query.pageNumber - 1) * query.pageSize

        const commentsData = await CommentModel.find({})
            // .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)


        const totalCount = await CommentModel.countDocuments()
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
        const commentData = await CommentModel.findOne({ _id: new ObjectId(id) })
        if (!commentData) return null
        return getViewModelComment(commentData)
    },
}