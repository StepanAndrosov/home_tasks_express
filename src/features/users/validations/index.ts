import { body } from "express-validator";

// login* string => maxLength: 10; minLength: 3; pattern: ^[a-zA-Z0-9_-]*$
// password* string => maxLength: 20; minLength: 6
// email* string => pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ example: example@example.com must be unique

export const validUsersLengthFields = {
    login: { min: 3, max: 10 },
    password: { min: 6, max: 20 }
}

export const errRequiredLogin = 'login is required'
export const errValidLogin = 'login does not valid'
export const errLengthLogin = `login must be shorter than ${validUsersLengthFields.login.max} or larger than ${validUsersLengthFields.login.min} characters`

export const errRequiredPassword = 'password is required'
export const errLengthName = `password must be shorter than shorter than ${validUsersLengthFields.password.max} or larger than ${validUsersLengthFields.password.min} characters`

export const errRequiredEmail = 'email is required'
export const errValidEmail = 'email does not match email address'

const customLoginValidator = async (login?: string) => {
    let loginPattern = /^[a-zA-Z0-9_-]*$/gmi;
    if (!login || !login.length)
        throw new Error(errRequiredLogin);
    const isValid = loginPattern.test(login)
    if (isValid) {
        return true
    } else {
        throw new Error(errValidLogin)
    };
}

export const validationLogin = () => body("login").trim().notEmpty().withMessage(errRequiredLogin)
    .isLength({ min: validUsersLengthFields.login.min, max: validUsersLengthFields.login.max }).withMessage(errLengthLogin)
    .custom(customLoginValidator)

export const validationPassword = () => body("password").trim().notEmpty().withMessage(errRequiredPassword)
    .isLength({ min: validUsersLengthFields.password.min, max: validUsersLengthFields.password.max })
    .withMessage(errLengthName)

export const validationEmail = () => body("email").trim().notEmpty().withMessage(errRequiredEmail)
    .isEmail().withMessage(errValidEmail)

