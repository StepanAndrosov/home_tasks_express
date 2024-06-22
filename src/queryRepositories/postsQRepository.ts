
import { commentsCollection, postsCollection } from "../db/db";
import { SanitizedQuery } from "../utils/helpers";
import { getViewModelPost } from "../repositories/postsRepository";
import { ObjectId } from "mongodb";
import { PostIdCommentsPaginateModel } from "../features/comments/models/PostIdCommentsPaginateModel";
import { getViewModelComment } from "../repositories/commentsRepository";

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
    },
    async findPost(id: string) {
        const postData = await postsCollection.findOne({ _id: new ObjectId(id) })
        if (!postData) return null
        return getViewModelPost(postData)
    },
    async getPostIdComments(postId: string, query: SanitizedQuery): Promise<PostIdCommentsPaginateModel> {

        const search = query.searchNameTerm ? { title: { $regex: query.searchNameTerm, $options: 'i' } } : {}
        const skip = (query.pageNumber - 1) * query.pageSize

        const filter = {
            postId,
            ...search,
        }

        const commentsData = await commentsCollection.find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / query.pageSize)

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: commentsData.map((c) => getViewModelComment(c))
        }
    },
}