import { body } from "express-validator";

// login* string => maxLength: 10; minLength: 3; pattern: ^[a-zA-Z0-9_-]*$
// password* string => maxLength: 20; minLength: 6

export const validUsersLengthFields = {
    loginOrEmail: { min: 3, max: 10 },
    password: { min: 6, max: 20 },
    login: { min: 3, max: 10 },
}

export const errRequiredLogin = 'login or email is required'
export const errValidLogin = 'login or email does not valid'
export const errLengthLogin = `login or email must be shorter than ${validUsersLengthFields.loginOrEmail.max} or larger than ${validUsersLengthFields.loginOrEmail.min} characters`

export const errRequiredPassword = 'password is required'
export const errLengthName = `password must be shorter than shorter than ${validUsersLengthFields.password.max} or larger than ${validUsersLengthFields.password.min} characters`

export const validationLoginOrEmail = () => body("loginOrEmail").trim().notEmpty().withMessage(errRequiredLogin)
    .isLength({ min: validUsersLengthFields.loginOrEmail.min, max: validUsersLengthFields.loginOrEmail.max }).withMessage(errLengthLogin)

export const validationPassword = () => body("password").trim().notEmpty().withMessage(errRequiredPassword)
    .isLength({ min: validUsersLengthFields.password.min, max: validUsersLengthFields.password.max })
    .withMessage(errLengthName)


