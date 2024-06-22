
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
}
