import { SortDirection } from "mongodb"

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SORT_BY = 'createdAt'
const DEFAULT_SORT_DIRECTION = 'desc'

export const sanitizeQuery = (query: { [key: string]: string | undefined }) => {
    return {
        pageNumber: query.pageNumber ? Number(query.pageNumber) : DEFAULT_PAGE_NUMBER,
        pageSize: query.pageSize ? Number(query.pageSize) : DEFAULT_PAGE_SIZE,
        sortBy: query.sortBy ? query.sortBy : DEFAULT_SORT_BY,
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : DEFAULT_SORT_DIRECTION,
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null
    }
}

export type SanitizedQuery = ReturnType<typeof sanitizeQuery> 