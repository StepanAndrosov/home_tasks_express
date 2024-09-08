export class CreateCommentDto {
    constructor(
        public content: string,
        public postId: string,
    ) { }
}