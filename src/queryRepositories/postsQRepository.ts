
import { commentsCollection } from "../db/db";
import { SanitizedQuery } from "../utils/helpers";
import { getViewModelPost } from "../repositories/postsRepository";
import { ObjectId } from "mongodb";
import { CommentsPaginateModel } from './../features/comments/models/CommentsPaginateModel';
import { getViewModelComment } from "../repositories/commentsRepository";
import { PostModel } from "../features/posts/domain";

export const postsQRepository = {
    async getPosts(query: SanitizedQuery) {

        const skip = (query.pageNumber - 1) * query.pageSize

        const postsData = await PostModel.find({})
            // .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)

        const totalCount = await PostModel.countDocuments()
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
        const postData = await PostModel.findOne({ _id: new ObjectId(id) })
        if (!postData) return null
        return getViewModelPost(postData)
    },
    async getPostIdComments(postId: string, query: SanitizedQuery): Promise<CommentsPaginateModel> {

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

        const totalCount = await commentsCollection.countDocuments(filter)
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