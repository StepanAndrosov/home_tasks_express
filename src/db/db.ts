import { DBType } from "../types";

export const db: DBType = {
    videos: [
        {
            id: 0,
            title: 'Start Video',
            author: 'Ivan',
            canBeDownloaded: true,
            minAgeRestriction: 6,
            createdAt: '2024-04-28T04:26:10.752Z',
            publicationDate: '2024-04-28T04:26:10.752Z',
            availableResolutions: ['P144']
        },
        {
            id: 1,
            title: 'Next Video',
            author: 'Ivan',
            canBeDownloaded: true,
            minAgeRestriction: 6,
            createdAt: '2024-04-28T04:26:10.752Z',
            publicationDate: '2024-04-28T04:26:10.752Z',
            availableResolutions: ['P240']
        }
    ]
}