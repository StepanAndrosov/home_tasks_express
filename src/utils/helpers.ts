import { SortDirection } from "mongodb"

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTEND_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    NOT_AUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    TOO_MANY_REQUESTS: 429
} as const

type StatusesKeys = keyof typeof HTTP_STATUSES
export type HttpStatuses = typeof HTTP_STATUSES[StatusesKeys]

export const SEC = 1000
export const MIN = SEC * 60
export const HOUR = MIN * 60
export const DAY = HOUR * 24


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

export const sanitizeUsersQuery = (query: { [key: string]: string | undefined }) => {
    return {
        pageNumber: query.pageNumber ? Number(query.pageNumber) : DEFAULT_PAGE_NUMBER,
        pageSize: query.pageSize ? Number(query.pageSize) : DEFAULT_PAGE_SIZE,
        sortBy: query.sortBy ? query.sortBy : DEFAULT_SORT_BY,
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : DEFAULT_SORT_DIRECTION,
        searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null
    }
}

export type SanitizedUsersQuery = ReturnType<typeof sanitizeUsersQuery>

/** 
 * @refreshTokeh 
 * is stored in cookies and has a deviceId in payload
 */
export const getDeviceInfoByToken = (refreshToken?: string) => {
    if (!refreshToken) return {
        deviceId: ''
    }
    // find and decode refresh token payload 
    const [_, payload] = refreshToken.split('.')
    const decoded = Buffer.from(payload, 'base64').toString()

    const deviceId = JSON.parse(decoded).deviceId as string
    const lastActiveDate = JSON.parse(decoded).iat as string
    const userId = JSON.parse(decoded).userId as string | undefined

    return {
        deviceId,
        lastActiveDate,
        userId
    }
}


