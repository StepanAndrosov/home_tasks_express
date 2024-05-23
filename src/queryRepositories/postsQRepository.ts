
import { postsCollection } from "../db/db";
import { SanitizedQuery } from "../features/blogs/sanitizeQuery";
import { getViewModelPost } from "../repositories/postsRepository";

export const postsQRepository = {
    async getPosts(query: SanitizedQuery) {

        const skip = (query.pageNumber - 1) * query.pageSize

        const postsData = await postsCollection.find({})
            .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)
            .toArray()


        const pagesCount = Math.ceil(postsData.length / query.pageSize)

        const totalCount = await postsCollection.countDocuments()

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: postsData.map((p) => getViewModelPost(p))
        }
    }
}