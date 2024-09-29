import { CreateLikeDto } from "../features/likes/domain/CreateLikeDto"
import { LikeModel } from "../features/likes/domain/like.entity"

class LikesRepository {
    async testDeleteData() {
        await LikeModel.deleteMany({})
    }
    async createLike(createData: CreateLikeDto) {
        const newLike = LikeModel.createLike(createData)

        await newLike.save()
    }
}

export const likesRepository = new LikesRepository()