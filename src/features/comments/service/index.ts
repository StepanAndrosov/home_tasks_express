import { likesQRepository } from './../../../queryRepositories/likesQRepository';
import { commentsQRepository } from "../../../queryRepositories/commentsQRepository";
import { Result } from "../../../types";
import { LikeStatus } from "../../likes/models/LikeStatus";
import { commentsRepository } from '../../../repositories/commentsRepository';
import { likesRepository } from '../../../repositories/likesRepository';
import { CommentViewModel } from '../models/CommentViewModel';

class CommentsService {
    async updateLikes(commentId: string, status: LikeStatus, userId: string): Promise<Result<undefined>> {
        const foundComment = await commentsQRepository.findComment(commentId)

        if (!foundComment) {
            return {
                status: 'NotFound'
            }
        }

        const foundLike = await likesQRepository.getLikeByAuthorAndParent(userId, commentId)
        console.log(foundLike?._id.toString(), 'foundLike id')
        if (!foundLike) {
            await likesRepository.createLike({ authorId: userId, parent: { id: commentId, type: 'Comment' }, status })
            if (status === 'Like') {
                await commentsRepository.increaseLike(commentId)
            }
            if (status === 'Dislike')
                await commentsRepository.increaseDislike(commentId)
        }

        if (foundLike) {
            if (foundLike.status === 'Like') {
                if (status === 'Like') {
                    console.log('got:', status, 'found:', foundLike.status)
                    await likesRepository.updateLike(foundLike._id, 'None')
                    await commentsRepository.decreaseLike(commentId)
                }
                if (status === 'Dislike') {
                    console.log('got:', status, 'found:', foundLike.status)
                    await likesRepository.updateLike(foundLike._id, status)
                    await commentsRepository.decreaseLike(commentId)
                    await commentsRepository.increaseDislike(commentId)
                }
            } else if (foundLike.status === 'Dislike') {
                if (status === 'Dislike') {
                    console.log('got:', status, 'found:', foundLike.status)
                    await likesRepository.updateLike(foundLike._id, 'None')
                    await commentsRepository.decreaseDislike(commentId)
                }
                if (status === 'Like') {
                    console.log('got:', status, 'found:', foundLike.status)
                    await likesRepository.updateLike(foundLike._id, status)
                    await commentsRepository.decreaseDislike(commentId)
                    await commentsRepository.increaseLike(commentId)
                }
            } else {
                console.log('got:', status, 'found:', foundLike.status)
                await likesRepository.updateLike(foundLike._id, status)
                if (status === 'Like') {
                    await commentsRepository.increaseLike(commentId)
                }
                if (status === 'Dislike') {
                    await commentsRepository.increaseDislike(commentId)
                }
            }
        }

        return {
            status: 'Success'
        }
    }
    async getCommentWithMyStatus(commentId: string, userId: string | undefined): Promise<CommentViewModel | null> {
        const foundComment = await commentsQRepository.findComment(commentId)
        if (userId) {
            if (userId === foundComment?.commentatorInfo.userId) {
                const foundLike = await likesQRepository.getLikeByAuthorAndParent(userId, commentId)
                return {
                    ...foundComment,
                    likesInfo: {
                        ...foundComment.likesInfo,
                        myStatus: foundLike?.status ?? 'None'
                    }
                }
            } else return foundComment
        } else return foundComment
    }
}

export const commentsService = new CommentsService()