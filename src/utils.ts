
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTEND_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    NOT_AUTHORIZED_401: 401
} as const

type StatusesKeys = keyof typeof HTTP_STATUSES
export type HttpStatuses = typeof HTTP_STATUSES[StatusesKeys]



export const SEC = 1000
export const MIN = SEC * 60
export const HOUR = MIN * 60
export const DAY = HOUR * 24