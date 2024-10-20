import { LikeParentType } from "../models/LikeParent";
import { LikeStatus } from "../models/LikeStatus";

export class CreateLikeDto {
    constructor(
        public status: LikeStatus,
        public authorId: string,
        public authorName: string,
        public parent: { id: string, type: LikeParentType }
    ) { }
}