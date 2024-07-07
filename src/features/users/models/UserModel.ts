import { WithId } from "mongodb"


interface User {
    /**
    * User login  
    */
    login: string
    /**
    * User password hash with salt 
    */
    passwordHash: string
    /**
    * User email  
    */
    email: string
    /**
    * Created time user 
    */
    createdAt: string
    /**
    * Email confirmation data
    */
    emailConfirmation: {
        confirmationCode: string
        expirationDate: string
        isConfirmed: boolean
    }
}

export type UserModel = WithId<User>