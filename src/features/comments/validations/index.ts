import { body, param } from "express-validator";

// content*	string
// maxLength: 300
// minLength: 20

export const validCommentLengthFields = {
    content: { min: 20, max: 300 }
}

export const errRequiredCommentContent = 'content required'
export const errLengthContent = `content must be shorter than ${validCommentLengthFields.content.max} or larger than ${validCommentLengthFields.content.min} characters`

export const errId = 'id does not valid'

export const validationCommentContent = () => body("content").trim().notEmpty().withMessage(errRequiredCommentContent)
    .isLength({ min: validCommentLengthFields.content.min, max: validCommentLengthFields.content.max })
    .withMessage(errLengthContent)

export const validParamId = () => param('id').isMongoId().withMessage(errId)

