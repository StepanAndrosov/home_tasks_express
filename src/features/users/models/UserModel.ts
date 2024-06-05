import { WithId } from "mongodb"


interface User {

    /**
    * User login  
    */
    login: string,
    /**
    * User password hash with salt 
    */
    password: string,
    /**
    * User email  
    */
    email: string,
    /**
    * Created time user 
    */
    createdAt: string
}

export type UserModel = WithId<User>