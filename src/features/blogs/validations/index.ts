import { body, param } from "express-validator";

// name*	string => maxLength: 15
// description*	string => maxLength: 500
// websiteUrl*	string => maxLength: 100 =>  pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const validPostsLengthFields = {
    name: 15,
    description: 500,
    websiteUrl: 100
}

export const errRequiredWebsiteUrl = 'the website Url is required'
export const errValidWebsiteUrl = 'the website Url does not match valid url'
export const errLengthWebsiteUrl = `the  website Url must be shorter than ${validPostsLengthFields.websiteUrl} characters`

export const errRequiredBlogName = 'the name required'
export const errLengthName = `the name must be shorter than ${validPostsLengthFields.name} characters`

export const errRequiredDescription = 'the description required'
export const errLengthDescription = `the description must be shorter than ${validPostsLengthFields.description} characters`

export const errId = 'id does not valid'

export const validationWebsiteUrl = () => body("websiteUrl").trim().notEmpty().withMessage(errRequiredWebsiteUrl)
    .isURL({ require_protocol: true, require_valid_protocol: true }).withMessage(errValidWebsiteUrl)
    .isLength({ max: validPostsLengthFields.websiteUrl }).withMessage(errLengthWebsiteUrl)

export const validationBlogName = () => body("name").trim().notEmpty().withMessage(errRequiredBlogName)
    .isLength({ max: validPostsLengthFields.name })
    .withMessage(errLengthName)

export const validationDescription = () => body("description").trim().notEmpty().withMessage(errRequiredDescription)
    .isLength({ max: validPostsLengthFields.description })
    .withMessage(errLengthDescription)


export const validBlogParamId = () => param('id').isMongoId().withMessage(errId)
