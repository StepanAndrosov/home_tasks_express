import { ObjectId } from "mongodb";
import { CreatePostDto, PostModel } from "../features/posts/domain";
import { IPostModel } from "../features/posts/models/IPostModel";
import { PostUpdateModel } from "../features/posts/models/PostUpdateModel";
import { PostViewModel } from "../features/posts/models/PostViewModel";

export const getViewModelPost = (post: IPostModel): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

class PostsRepository {
    async testDeleteData() {
        await PostModel.deleteMany({})
    }
    async createPost(dto: CreatePostDto, blogName: string) {

        const newPost = PostModel.createPost(dto, dto.blogId, blogName)

        await newPost.save()

        return getViewModelPost(newPost)
    }
    async updatePost(id: string, updateData: PostUpdateModel) {

        const foundPostModel = await PostModel.findOne({ _id: new ObjectId(id) })

        if (!foundPostModel) return false

        foundPostModel.title = updateData.title
        foundPostModel.shortDescription = updateData.shortDescription
        foundPostModel.content = updateData.content
        foundPostModel.blogId = updateData.blogId

        await foundPostModel.save()

        return true
    }
    async deletePost(id: string) {
        await PostModel.deleteOne({ _id: new ObjectId(id) })
    }
}

export const postsRepository = new PostsRepository()