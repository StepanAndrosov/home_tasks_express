
import { usersCollection } from "../db/db";
import { SanitizedQuery } from "../utils";
import { getViewModelUser } from "../repositories/usersRepository";

export const usersQRepository = {
    async getUsers(query: SanitizedQuery) {

        const skip = (query.pageNumber - 1) * query.pageSize

        const usersData = await usersCollection.find({})
            .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)
            .toArray()


        const totalCount = await usersCollection.countDocuments()
        const pagesCount = Math.ceil(totalCount / query.pageSize)

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: usersData.map((u) => getViewModelUser(u))
        }
    }
}