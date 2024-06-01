
import { postsCollection } from "../db/db";
import { SanitizedQuery } from "../utils";
import { getViewModelPost } from "../repositories/postsRepository";

export const postsQRepository = {
    async getPosts(query: SanitizedQuery) {

        const skip = (query.pageNumber - 1) * query.pageSize

        const postsData = await postsCollection.find({})
            .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)
            .toArray()


        const totalCount = await postsCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / query.pageSize)


        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: postsData.map((p) => getViewModelPost(p))
        }
    }
}