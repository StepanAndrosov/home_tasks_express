import { body } from "express-validator";

// login* string => maxLength: 10; minLength: 3; pattern: ^[a-zA-Z0-9_-]*$
// password* string => maxLength: 20; minLength: 6

export const validAuthLengthFields = {
    loginOrEmail: { min: 3, max: 10 },
    password: { min: 6, max: 20 },
    login: { min: 3, max: 10 },
}

export const errRequiredLoginOrEmail = 'login or email is required'
export const errLengthLoginOrEmail = `login or email must be shorter than ${validAuthLengthFields.loginOrEmail.max} or larger than ${validAuthLengthFields.loginOrEmail.min} characters`

export const errRequiredPassword = 'password is required'
export const errLengthPassword = `password must be shorter than shorter than ${validAuthLengthFields.password.max} or larger than ${validAuthLengthFields.password.min} characters`

export const errRequiredLogin = 'login is required'
export const errValidLogin = 'login does not valid'
export const errLengthLogin = `login must be shorter than ${validAuthLengthFields.login.max} or larger than ${validAuthLengthFields.login.min} characters`

export const errRequiredEmail = 'email is required'
export const errValidEmail = 'email does not match email address'

export const errRequiredCode = 'code is required'

export const validationLoginOrEmail = () => body("loginOrEmail").trim().notEmpty().withMessage(errRequiredLoginOrEmail)
    .isLength({ min: validAuthLengthFields.loginOrEmail.min, max: validAuthLengthFields.loginOrEmail.max }).withMessage(errLengthLoginOrEmail)

export const validationPassword = () => body("password").trim().notEmpty().withMessage(errRequiredPassword)
    .isLength({ min: validAuthLengthFields.password.min, max: validAuthLengthFields.password.max })
    .withMessage(errLengthPassword)

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
    .isLength({ min: validAuthLengthFields.login.min, max: validAuthLengthFields.login.max }).withMessage(errLengthLogin)
    .custom(customLoginValidator)

export const validationEmail = () => body("email").trim().notEmpty().withMessage(errRequiredEmail)
    .isEmail().withMessage(errValidEmail)

export const validationCode = () => body("code").trim().notEmpty().withMessage(errRequiredCode)




