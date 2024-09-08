
import { ObjectId } from "mongodb";
import { UserModel } from "../features/users/domain/user.entity";
import { getViewModelUser } from "../repositories/usersRepository";
import { SanitizedUsersQuery } from "../utils/helpers";

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

        const usersData = await UserModel.find(filter)
            // .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)

        const totalCount = await UserModel.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / query.pageSize)

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: usersData.map((u) => getViewModelUser(u))
        }
    },
    async findUsersByTerm(findData: { [term: string]: string | ObjectId }) {
        const usersData = await UserModel.find(findData)
        return usersData
    },
    async findUsersByOneOfTerms(findData: { [term: string]: string }[]) {
        const usersData = await UserModel.find({ $or: findData })
        return usersData
    },
    async findUserById(id: string) {
        const userData = await UserModel.findOne({ _id: new ObjectId(id) })
        if (!userData) return null
        return getViewModelUser(userData)
    },
}