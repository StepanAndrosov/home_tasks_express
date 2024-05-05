import { body } from "express-validator";
import { Resolution } from "../../../types";


// name*	string => maxLength: 15
// description*	string => maxLength: 500
// websiteUrl*	string => maxLength: 100 =>  pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$


export const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const

export const validLengthFields = {
    name: 15,
    description: 500,
    websiteUrl: 100
}

export const errRequiredWebsiteUrl = 'the website Url is required'
export const errValidWebsiteUrl = 'the website Url does not match valid url'

export const errRequiredBlogName = 'the name required'
export const errLengthName = `the name must be shorter than ${validLengthFields.name} characters`

export const errRequiredDescription = 'the description required'
export const errLengthDescription = `the description must be shorter than ${validLengthFields.description} characters`

export const validationWebsiteUrl = () => body("websiteUrl").trim().notEmpty().withMessage(errRequiredWebsiteUrl)
    .isURL({ require_protocol: true, require_valid_protocol: true }).withMessage(errValidWebsiteUrl)

export const validationBlogName = () => body("name").trim().notEmpty().withMessage(errRequiredBlogName)
    .isLength({ max: validLengthFields.name })
    .withMessage(errLengthName)

export const validationDescription = () => body("description").trim().notEmpty().withMessage(errRequiredDescription)
    .isLength({ max: validLengthFields.description })
    .withMessage(errLengthDescription)
