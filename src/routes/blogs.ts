import express, { Request, Response } from 'express'
import { BlogCreateModel } from '../features/blogs/models/BlogCreateModel'
import { BlogIdParamsModel } from '../features/blogs/models/BlogIdParamsModel'
import { BlogModel } from '../features/blogs/models/BlogModel'
import { BlogViewModel } from '../features/blogs/models/BlogViewModel'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { blogsRepository } from '../repositories/blogsRepository'
import { ErrorsMessagesType, RequestWithBody, RequestWithParams } from '../types'
import { HTTP_STATUSES, } from '../utils'
import { validationBlogName, validationDescription, validationWebsiteUrl } from '../features/blogs/validations'
import { authenticationMiddleware } from '../middlewares/authentication '

export const getBlogsRouter = () => {
    const router = express.Router()

    router.get('/', (req: Request, res: Response<BlogModel[]>) => {
        const blogs = blogsRepository.getBlogs()
        res.json(blogs)
        res.sendStatus(HTTP_STATUSES.OK_200)
    })

    router.post('/',
        authenticationMiddleware,
        validationBlogName(),
        validationDescription(),
        validationWebsiteUrl(),
        inputValidMiddleware,
        (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | ErrorsMessagesType>) => {

            const newBlog = blogsRepository.createBlog(req.body)
            res
                .status(HTTP_STATUSES.CREATED_201)
                .send(newBlog)
        })

    router.get('/:id',
        (req: RequestWithParams<BlogIdParamsModel>, res: Response<BlogViewModel>) => {

            const foundBlog = blogsRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            res.json(foundBlog)
            res.sendStatus(HTTP_STATUSES.OK_200)
        })

    router.put('/:id',
        authenticationMiddleware,
        validationBlogName(),
        validationDescription(),
        validationWebsiteUrl(),
        inputValidMiddleware,
        (req: Request, res: Response<ErrorsMessagesType>) => {

            const foundBlog = blogsRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            const foundindex = blogsRepository.findIndex(foundBlog)

            if (foundindex < 0) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            blogsRepository.updateBlog(foundindex, foundBlog, req.body)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/:id',
        authenticationMiddleware,
        (req: Request, res: Response<BlogViewModel>) => {
            const foundBlog = blogsRepository.findBlog(req.params.id)
            if (!foundBlog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            const foundindex = blogsRepository.findIndex(foundBlog)

            if (foundindex < 0) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            blogsRepository.deleteBlog(foundindex)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}
