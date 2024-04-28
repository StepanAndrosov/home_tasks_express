
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTEND_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

export const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'] as const

export const validLengthFields = {
    videoTitle: 40,
    videoAuthor: 20
}