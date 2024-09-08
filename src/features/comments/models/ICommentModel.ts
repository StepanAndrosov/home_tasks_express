import { WithId } from "mongodb"


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
}

export type ICommentModel = WithId<Comment>