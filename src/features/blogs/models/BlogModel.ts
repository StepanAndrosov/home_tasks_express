import { WithId } from "mongodb"


interface Blog {
    /**
    * Blog name 
    */
    name: string,
    /**
    * Blog description
    */
    description: string,
    /**
    *  Website Url current blog
    */
    websiteUrl: string,
    /**
    *  Created date current blog
    */
    createdAt: string,
    /**
    *  True if user has not expired membership subscription to blog
    */
    isMembership: boolean
}

export type BlogModel = WithId<Blog>
