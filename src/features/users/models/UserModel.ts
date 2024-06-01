import { WithId } from "mongodb"


interface User {

    /**
    * User login  
    */
    login: string,
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