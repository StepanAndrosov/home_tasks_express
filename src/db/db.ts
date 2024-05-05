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
    ],
    blogs: [
        {
            id: '1',
            name: 'it-boroda',
            description: 'The creat it podcast',
            websiteUrl: 'https://it-boroda.com'
        },
        {
            id: '2',
            name: 'we are doomed',
            description: 'The creat it podcast with some humor',
            websiteUrl: 'https://wearedoomed.com'
        },
    ],
    posts: [
        {
            id: '1',
            title: 'Interview 1',
            shortDescription: 'Interview with yandex founder',
            blogId: '1',
            blogName: 'it-boroda',
            content: 'it podcasts'
        },
        {
            id: '2',
            title: 'Interview 1',
            shortDescription: 'Interview with yandex founder',
            blogId: '2',
            blogName: 'we are doomed',
            content: 'it podcasts'
        },
    ]
}