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
    * Created time comment 
    */
    createdAt: string
}

export type CommentModel = WithId<Comment>