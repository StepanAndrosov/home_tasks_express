import { LikeStatus } from "../../likes/models/LikeStatus"

export interface PostViewModel {
    /**
    * Post id 
    */
    id: string,
    /**
    * Post title 
    */
    title: string,
    /**
    * Post description
    */
    shortDescription: string,
    /**
    *  Post content
    */
    content: string,
    /**
     * Post`s Blog Id 
     */
    blogId: string,
    /**
    * Post blogName
    */
    blogName: string
    /**
    * Created time post 
    */
    createdAt: string
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: LikeStatus
        newestLikes:
        {
            addedAt: string
            userId: string
            login: string
        }[]

    }
}

