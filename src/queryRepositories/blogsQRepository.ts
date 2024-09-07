
import { ObjectId } from "mongodb";
import { postsCollection } from "../db/db";
import { BlogModel } from "../features/blogs/domain/blog.entity";
import { getViewModelBlog } from "../repositories/blogsRepository";
import { getViewModelPost } from "../repositories/postsRepository";
import { SanitizedQuery } from "../utils/helpers";
import { PostsPaginateModel } from "../features/posts/models/PostsPaginateModel";

export const blogsQRepository = {
    async getBlogs(query: SanitizedQuery) {

        const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: 'i' } } : {}

        const filter = {
            ...search,
        }

        const skip = (query.pageNumber - 1) * query.pageSize

        const blogsData = await BlogModel.find(filter)
            // .sort(query.sortBy, query.sortDirection)  !TODO realize sort by name and sort direction
            .skip(skip)
            .limit(query.pageSize)

        const totalCount = await BlogModel.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / query.pageSize)

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: blogsData.map((b) => getViewModelBlog(b))
        }
    },
    async findBlog(id: string) {
        const blogData = await BlogModel.findOne({ _id: new ObjectId(id) })
        if (!blogData) return null
        return getViewModelBlog(blogData)
    },
    async getBlogIdPosts(blogId: string, query: SanitizedQuery): Promise<PostsPaginateModel> {

        const search = query.searchNameTerm ? { title: { $regex: query.searchNameTerm, $options: 'i' } } : {}
        const skip = (query.pageNumber - 1) * query.pageSize

        const filter = {
            blogId,
            ...search,
        }

        const postsData = await postsCollection.find(filter)
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
            items: postsData.map((p) => getViewModelPost(p))
        }
    },

}