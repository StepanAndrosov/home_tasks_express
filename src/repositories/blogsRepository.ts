import { v4 } from "uuid";
import { db } from "../db/db";
import { BlogCreateModel } from "../features/blogs/models/BlogCreateModel";
import { BlogModel } from "../features/blogs/models/BlogModel";
import { BlogUpdateModel } from "../features/blogs/models/BlogUpdateModel";

export const blogsRepository = {
    testDeleteData() {
        db.blogs = []
    },
    getBlogs() {
        return db.blogs
    },
    findBlog(id: string) {
        return db.blogs.find(v => v.id === id)
    },
    findIndex(blog: BlogModel) {
        return db.blogs.indexOf(blog)
    },
    createBlog(createData: BlogCreateModel) {
        const newBlog = {
            id: v4(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
        }

        db.blogs.push(newBlog)

        return newBlog
    },
    updateBlog(index: number, foundBlog: BlogModel, updateData: BlogUpdateModel) {
        const newBlog = {
            ...foundBlog,
            ...updateData
        }
        db.blogs.splice(index, 1, newBlog)
    },
    deleteBlog(index: number) {
        db.blogs.splice(index, 1)
    }
}