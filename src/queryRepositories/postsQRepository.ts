
import { ObjectId } from "mongodb";
import { CommentModel } from "../features/comments/domain/comment.entity";
import { PostModel } from "../features/posts/domain";
import { getViewModelComment } from "../repositories/commentsRepository";
import { getViewModelPost } from "../repositories/postsRepository";
import { SanitizedQuery } from "../utils/helpers";
import { CommentsPaginateModel } from './../features/comments/models/CommentsPaginateModel';
import { commentsService } from "../features/comments/service";
import { CommentViewModel } from "../features/comments/models/CommentViewModel";

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
    async getPostIdComments(postId: string, query: SanitizedQuery, userId: string | undefined): Promise<CommentsPaginateModel> {

        const search = query.searchNameTerm ? { title: { $regex: query.searchNameTerm, $options: 'i' } } : {}
        const skip = (query.pageNumber - 1) * query.pageSize

        const filter = {
            postId,
            ...search,
        }

        const commentsData = await CommentModel.find(filter)
            // .sort(query.sortBy, query.sortDirection)
            .skip(skip)
            .limit(query.pageSize)

        let commentDataWithMyStatus: CommentViewModel[] = []

        commentsData.map((c) => getViewModelComment(c)).map(async (c) => {
            const comment = await commentsService.parseCommentWithMyStatus(c, userId)
            console.log(comment)
            commentDataWithMyStatus.push(comment)
        })

        const totalCount = await CommentModel.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / query.pageSize)

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: commentDataWithMyStatus.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // commentsData.map((c) => getViewModelComment(c))
        }
    },
}