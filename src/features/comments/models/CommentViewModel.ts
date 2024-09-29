import { LikeStatus } from "../../likes/models/LikeStatus"

export interface CommentViewModel {
    /**
    * Comment id 
    */
    id: string,
    /**
    * Comment content  
    */
    content: string,
    /**
    * Comment commentatorInfo  
    */
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
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
