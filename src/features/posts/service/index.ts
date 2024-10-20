import { postsQRepository } from "../../../queryRepositories/postsQRepository";
import { likesRepository } from '../../../repositories/likesRepository';
import { postsRepository } from "../../../repositories/postsRepository";
import { Result } from "../../../types";
import { LikeStatus } from "../../likes/models/LikeStatus";
import { PostViewModel } from "../models/PostViewModel";
import { likesQRepository } from './../../../queryRepositories/likesQRepository';

class PostsService {
    async updateLike(postId: string, status: LikeStatus, user: { id: string, name: string }): Promise<Result<undefined>> {
        const foundPost = await postsQRepository.findPost(postId)

        if (!foundPost) {
            return {
                status: 'NotFound'
            }
        }

        const foundLike = await likesQRepository.getLikeByAuthorAndParent(user.id, postId)
        console.log(foundLike?._id.toString(), 'foundLike id')
        console.log('userId', user.id, foundLike?.authorId, 'foundLike authorId')
        if (!foundLike) {
            await likesRepository.createLike({ authorId: user.id, authorName: user.name, parent: { id: postId, type: 'Post' }, status })
            if (status === 'Like') {
                await postsRepository.increaseLike(postId)
            }
            if (status === 'Dislike')
                await postsRepository.increaseDislike(postId)
        } else {
            if (foundLike.status === 'Like') {
                if (status === 'Like') {
                    console.log('got:', status, 'found:', foundLike.status)
                }
                if (status === 'Dislike') {
                    console.log('got:', status, 'found:', foundLike.status)
                    await likesRepository.updateLike(foundLike._id, status)
                    await postsRepository.decreaseLike(postId)
                    await postsRepository.increaseDislike(postId)
                }
                if (status === 'None') {
                    await likesRepository.updateLike(foundLike._id, status)
                    await postsRepository.decreaseLike(postId)
                }
            } else if (foundLike.status === 'Dislike') {
                if (status === 'Dislike') {
                    console.log('got:', status, 'found:', foundLike.status)
                }
                if (status === 'Like') {
                    console.log('got:', status, 'found:', foundLike.status)
                    await likesRepository.updateLike(foundLike._id, status)
                    await postsRepository.decreaseDislike(postId)
                    await postsRepository.increaseLike(postId)
                }
                if (status === 'None') {
                    await likesRepository.updateLike(foundLike._id, status)
                    await postsRepository.decreaseDislike(postId)
                }
            } else if (foundLike.status === 'None') {
                console.log('got:', status, 'found:', foundLike.status)
                await likesRepository.updateLike(foundLike._id, status)
                if (status === 'Like') {
                    await postsRepository.increaseLike(postId)
                }
                if (status === 'Dislike') {
                    await postsRepository.increaseDislike(postId)
                }
            }
        }

        return {
            status: 'Success'
        }
    }
    async getPostWithMyStatus(postId: string, userId: string | undefined): Promise<PostViewModel | null> {
        const foundPost = await postsQRepository.findPost(postId)
        const foundLike = await likesQRepository.getLikeByAuthorAndParent(userId ?? '', postId)
        const foundLastLikes = await likesQRepository.getLikesByParentIdStatusLike(postId)
        console.log(foundLike, 'foundLike id')
        console.log('userId', userId, foundLike?.authorId, 'foundLike authorId')

        if (!foundPost) return null
        return {
            ...foundPost,
            extendedLikesInfo: {
                ...foundPost.extendedLikesInfo,
                myStatus: foundLike?.status ?? 'None',
                newestLikes: foundLastLikes ?? []
            }
        }
    }
    async parsePostWithMyStatus(post: PostViewModel, userId: string | undefined): Promise<PostViewModel> {

        const foundLike = await likesQRepository.getLikeByAuthorAndParent(userId ?? '', post.id)
        const foundLastLikes = await likesQRepository.getLikesByParentIdStatusLike(post.id)
        return {
            ...post,
            extendedLikesInfo: {
                ...post.extendedLikesInfo,
                myStatus: foundLike?.status ?? 'None',
                newestLikes: foundLastLikes ?? []
            }
        }
    }
}

export const postsService = new PostsService()


const arr = [
    {
        "id": "671466fa082b9832c2c2e477", "title": "post title", "shortDescription": "description", "content": "new post content", "blogId": "671466f4082b9832c2c2e459",
        "blogName": "new blog", "createdAt": "2024-10-20T02:12:10.526Z",
        "extendedLikesInfo": {
            "likesCount": 1, "dislikesCount": 1, "myStatus": "Like",
            "newestLikes": [
                { "addedAt": "", "userId": "671466e7082b9832c2c2e423", "login": "4987lg" }
            ]
        }
    },
    {
        "id": "671466f9082b9832c2c2e472", "title": "post title", "shortDescription": "description", "content": "new post content", "blogId": "671466f4082b9832c2c2e459",
        "blogName": "new blog", "createdAt": "2024-10-20T02:12:09.560Z",
        "extendedLikesInfo": {
            "likesCount": 1, "dislikesCount": 1, "myStatus": "None",
            "newestLikes": [
                { "addedAt": "", "userId": "671466e8082b9832c2c2e428", "login": "4988lg" }
            ]
        }
    },
    {
        "id": "671466f8082b9832c2c2e46d", "title": "post title", "shortDescription": "description", "content": "new post content", "blogId": "671466f4082b9832c2c2e459",
        "blogName": "new blog", "createdAt": "2024-10-20T02:12:08.588Z",
        "extendedLikesInfo": {
            "likesCount": 4, "dislikesCount": 0, "myStatus": "Like",
            "newestLikes": [
                { "addedAt": "", "userId": "671466e9082b9832c2c2e42d", "login": "4989lg" },
                { "addedAt": "", "userId": "671466e8082b9832c2c2e428", "login": "4988lg" },
                { "addedAt": "", "userId": "671466ea082b9832c2c2e432", "login": "4990lg" }
            ]
        }
    }, {
        "id": "671466f7082b9832c2c2e468", "title": "post title", "shortDescription": "description", "content": "new post content", "blogId": "671466f4082b9832c2c2e459",
        "blogName": "new blog", "createdAt": "2024-10-20T02:12:07.618Z",
        "extendedLikesInfo": { "likesCount": 0, "dislikesCount": 1, "myStatus": "Dislike", "newestLikes": [] }
    },
    {
        "id": "671466f6082b9832c2c2e463", "title": "post title", "shortDescription": "description", "content": "new post content", "blogId": "671466f4082b9832c2c2e459",
        "blogName": "new blog", "createdAt": "2024-10-20T02:12:06.650Z",
        "extendedLikesInfo": {
            "likesCount": 2, "dislikesCount": 0, "myStatus": "None",
            "newestLikes": [
                { "addedAt": "", "userId": "671466e9082b9832c2c2e42d", "login": "4989lg" },
                { "addedAt": "", "userId": "671466e8082b9832c2c2e428", "login": "4988lg" }]
        }
    },
    {
        "id": "671466f5082b9832c2c2e45e", "title": "post title", "shortDescription": "description", "content": "new post content", "blogId": "671466f4082b9832c2c2e459",
        "blogName": "new blog", "createdAt": "2024-10-20T02:12:05.680Z",
        "extendedLikesInfo": {
            "likesCount": 2, "dislikesCount": 0, "myStatus": "Like",
            "newestLikes": [
                { "addedAt": "", "userId": "671466e8082b9832c2c2e428", "login": "4988lg" },
                { "addedAt": "", "userId": "671466e7082b9832c2c2e423", "login": "4987lg" }
            ]
        }
    }
]