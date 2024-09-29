import { WithId } from "mongodb"
import { LikeStatus } from "../../likes/models/LikeStatus"


interface Comment {
    /**
    * Comment content  
    */
    content: string,
    /**
    *  Commentator info  
    */
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    /**
    * Post comment id
    */
    postId: string
    /**
    * Created time comment 
    */
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: LikeStatus
    }
}

export type ICommentModel = WithId<Comment>