
import { usersCollection } from "../db/db";
import { SanitizedUsersQuery } from "../utils/helpers";
import { getViewModelUser } from "../repositories/usersRepository";
import { ObjectId } from "mongodb";

export const usersQRepository = {
    async getUsers(query: SanitizedUsersQuery) {

        const search = {
            $or: [
                query.searchEmailTerm ? { email: { $regex: query.searchEmailTerm, $options: 'i' } } : {},
                query.searchLoginTerm ? { login: { $regex: query.searchLoginTerm, $options: 'i' } } : {}
            ]
        }

        const filter = {
            ...search,
        }

        const skip = (query.pageNumber - 1) * query.pageSize

        const usersData = await usersCollection.find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)
            .toArray()


        const totalCount = await usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / query.pageSize)

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: usersData.map((u) => getViewModelUser(u))
        }
    },
    async findUsersByTerm(findData: { [term: string]: string }) {
        const usersData = await usersCollection.find(findData).toArray()
        return usersData
    },
    async findUsersByOneOfTerms(findData: { [term: string]: string }[]) {
        const usersData = await usersCollection.find({ $or: findData }).toArray()
        return usersData
    },
    async findUserById(id: string) {
        const userData = await usersCollection.findOne({ _id: new ObjectId(id) })
        if (!userData) return null
        return getViewModelUser(userData)
    },
}