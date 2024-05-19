import { WithId } from "mongodb"


interface Post {

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
}

export type PostModel = WithId<Post>

