import { CreateLikeDto } from "../features/likes/domain/CreateLikeDto"
import { LikeModel } from "../features/likes/domain/like.entity"
import { ObjectId } from "mongodb"
import { LikeStatus } from "../features/likes/models/LikeStatus"
import { likesQRepository } from "../queryRepositories/likesQRepository"

class LikesRepository {
    async testDeleteData() {
        await LikeModel.deleteMany({})
    }
    async createLike(createData: CreateLikeDto) {
        const newLike = LikeModel.createLike(createData)

        await newLike.save()
    }
    async updateLike(likeId: ObjectId, status: LikeStatus) {
        const foundedLike = await likesQRepository.findLike(likeId)

        if (!foundedLike) return false

        foundedLike.updateLike(status)
        await foundedLike.save()
        return true
    }
}

export const likesRepository = new LikesRepository()