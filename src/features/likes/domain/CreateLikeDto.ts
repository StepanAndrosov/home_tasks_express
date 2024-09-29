import { LikeStatus } from "../models/LikeStatus";

export class CreateLikeDto {
    constructor(
        public status: LikeStatus,
        public authorId: string,
        public parentId: string
    ) { }
}