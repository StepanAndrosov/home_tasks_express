import { body } from "express-validator";
import { blogsRepository } from "../../../repositories/blogsRepository";

// title*	string => maxLength: 30
// shortDescription* string => maxLength: 100
// content*	string => maxLength: 1000
// blogId*	string

export const validPostsLengthFields = {
    title: 30,
    shortDescription: 100,
    content: 1000
}

export const errRequiredPostTitle = 'the title required'
export const errLengthPostTitle = `the title must be shorter than ${validPostsLengthFields.title} characters`

export const errRequiredPostDescription = 'the short sescription required'
export const errLengthPostDescription = `the short sescription must be shorter than ${validPostsLengthFields.shortDescription} characters`

export const errRequiredContent = 'the content is required'
export const errLengthPostContent = `the content must be shorter than ${validPostsLengthFields.title} characters`

export const errRequiredBlogId = 'the blogId is required'
export const errExistBlog = 'blog could not be found'

export const validationPostTile = () => body("title").trim().notEmpty().withMessage(errRequiredPostTitle)
    .isLength({ max: validPostsLengthFields.title })
    .withMessage(errLengthPostTitle)

export const validationPostDescription = () => body("shortDescription").trim().notEmpty().withMessage(errRequiredPostDescription)
    .isLength({ max: validPostsLengthFields.shortDescription })
    .withMessage(errLengthPostDescription)

export const validationPostContent = () => body("content").trim().notEmpty().withMessage(errRequiredContent)
    .isLength({ max: validPostsLengthFields.content })
    .withMessage(errLengthPostContent)

const customBlogIdValidator = (blogId?: string) => {
    if (!blogId || !blogId.length)
        throw new Error(errRequiredBlogId);
    const foundBlog = blogsRepository.findBlog(blogId)
    if (!foundBlog)
        throw new Error(errExistBlog);
}

export const validationPostBlogId = () => body("blogId").trim().notEmpty().withMessage(errRequiredBlogId)
    .custom(customBlogIdValidator)

