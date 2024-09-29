import { likesQRepository } from './../../../queryRepositories/likesQRepository';
import { commentsQRepository } from "../../../queryRepositories/commentsQRepository";
import { Result } from "../../../types";
import { LikeStatus } from "../../likes/models/LikeStatus";
import { commentsRepository } from '../../../repositories/commentsRepository';
import { likesRepository } from '../../../repositories/likesRepository';

class CommentsService {
    async updateLikes(commentId: string, status: LikeStatus, userId: string): Promise<Result<undefined>> {
        const foundedComment = await commentsQRepository.findComment(commentId)

        if (!foundedComment) {
            return {
                status: 'NotFound'
            }
        }

        const foundedLike = await likesQRepository.getLikeByAuthorAndParent(userId, commentId)
        if (!foundedLike) {
            await likesRepository.createLike({ authorId: userId, parent: { id: commentId, type: 'Comment' }, status })
            if (status === 'Like')
                await commentsRepository.increaseLike(commentId)
            if (status === 'Dislike')
                await commentsRepository.increaseDislike(commentId)
            if (userId === foundedComment.commentatorInfo.userId) {
                await commentsRepository.updateMyStatusLike(commentId, status)
            }
        }

        if (foundedLike) {
            await likesRepository.updateLike(foundedLike._id, status)

            if (userId === foundedComment.commentatorInfo.userId) {
                await commentsRepository.updateMyStatusLike(commentId, status)
            }

            if (foundedLike.status === 'None') {
                if (status === 'Like')
                    await commentsRepository.increaseLike(commentId)
                if (status === 'Dislike')
                    await commentsRepository.increaseDislike(commentId)
            }

            if (foundedLike.status === 'Like') {
                if (status === 'Like')
                    await commentsRepository.decreaseLike(commentId)
                if (status === 'Dislike') {
                    await commentsRepository.decreaseLike(commentId)
                    await commentsRepository.increaseDislike(commentId)
                }
            }

            if (foundedLike.status === 'Dislike') {
                if (status === 'Dislike')
                    await commentsRepository.decreaseDislike(commentId)
                if (status === 'Like') {
                    await commentsRepository.decreaseDislike(commentId)
                    await commentsRepository.increaseLike(commentId)
                }
            }
        }

        return {
            status: 'Success'
        }
    }
}

export const commentsService = new CommentsService()