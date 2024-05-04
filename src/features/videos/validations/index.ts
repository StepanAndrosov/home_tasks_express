import { body } from "express-validator";
import { Resolution } from "../../../types";

export const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const

export const validLengthFields = {
    videoTitle: 40,
    videoAuthor: 20,
    publicationDate: 24
}

const ageSettings = {
    min: 1,
    max: 18
}

export const errWrongAvailableResolutions = 'the availableResolutions is wrong'
export const errRequiredAvailableResolutions = 'the availableResolution required'
export const errMathValidAvailableResolutions = 'the resolution does not match valid values'

export const errRequiredTitle = 'the title required'
export const errLengthTitle = `the title must be shorter than ${validLengthFields.videoTitle} characters`

export const errRequiredAuthor = 'the author required'
export const errLengthAuthor = `the author must be shorter than ${validLengthFields.videoAuthor} characters`

export const errCanBeDownloaded = 'canBeDownloaded required'

export const errRequiredAgeRestriction = 'min age restriction required'
export const errAgeValueRestriction = `the min age restriction must be lower than ${ageSettings.max} and higher or equal than ${ageSettings.min}`
export const errMustNumberRestriction = 'the min age restriction must be a number'

export const errRequiredPublicationDate = 'the PublicationDate required'
export const errLengthPublicationDate = `the PublicationDate must be shorter than ${validLengthFields.videoTitle} characters`

const resolutionsValidator = (availableResolutionsData?: Resolution[]) => {
    if (!availableResolutionsData || !availableResolutionsData.length)
        throw new Error(errRequiredAvailableResolutions);
    if (!!availableResolutionsData.filter(r => !availableResolutions.includes(r as Resolution)).length)
        throw new Error(errMathValidAvailableResolutions);

    return true
}

export const validationResolutions = () => body("availableResolutions").isArray().withMessage(errWrongAvailableResolutions)
    .custom(resolutionsValidator)

export const validationTitle = () => body("title").trim().notEmpty().withMessage(errRequiredTitle)
    .isLength({ max: validLengthFields.videoTitle })
    .withMessage(errLengthTitle)

export const validationAuthor = () => body("author").trim().notEmpty().withMessage(errRequiredAuthor)
    .isLength({ max: validLengthFields.videoAuthor })
    .withMessage(errLengthAuthor)

export const canBeDownloadedValidator = () => body("canBeDownloaded").trim().notEmpty().isBoolean().withMessage(errCanBeDownloaded).toBoolean()


const ageValidator = (minAgeRestriction: number) => {
    if (isNaN(minAgeRestriction) || typeof minAgeRestriction !== 'number')
        throw new Error(errMustNumberRestriction);
    if (minAgeRestriction < ageSettings.min || minAgeRestriction > ageSettings.max)
        throw new Error(errAgeValueRestriction);

    return true
}

export const minAgeRestrictionValidator = () => body("minAgeRestriction").trim()
    .notEmpty().withMessage(errRequiredAgeRestriction).toInt()
    .custom(ageValidator)

export const validationPublicationDate = () => body("publicationDate").trim().notEmpty().withMessage(errRequiredPublicationDate)
    .isLength({ max: validLengthFields.publicationDate })
    .withMessage(errLengthPublicationDate)