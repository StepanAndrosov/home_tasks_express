
import { SanitizedQuery } from "../features/blogs/sanitizeQuery";
import { postsCollection } from "../db/db";
import { BlogIdPostsPaginateModel } from "../features/blogs/models/BlogIdPostsPaginateModel";
import { getViewModelPost } from "../repositories/postsRepository";
import { BlogIdPostCreateModel } from "../features/blogs/models/BlogIdPostCreateModel";
import { ObjectId } from "mongodb";


export const blogsQRepository = {
    async getBlogIdPosts(blogId: string, query: SanitizedQuery): Promise<BlogIdPostsPaginateModel> {

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

        const pagesCount = Math.ceil(postsData.length / query.pageSize)

        const totalCount = await postsCollection.countDocuments(filter)

        return {
            pagesCount,
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: postsData.map((p) => getViewModelPost(p))
        }
    },
    async createBlogIdPosts(blogId: string, body: BlogIdPostCreateModel, blogName: string) {
        const newPost = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
            blogName,
            createdAt: new Date(Date.now()).toISOString()
        }

        await postsCollection.insertOne(newPost)

        return getViewModelPost(newPost)
    }
}