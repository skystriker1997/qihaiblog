import {prisma} from './prisma'




export const selectAll = async () => {
    return prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            numberOfWords: true
        },
    });
}


export const selectByTags = async (tags: string[]) => {
    return prisma.post.findMany({
        where: {
            tags: {
                hasEvery: tags,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
            numberOfWords: true
        },
    });
}


export const selectBySlug = async (slug: string) => {
    return prisma.post.findUnique({
        where: {
            slug: slug,
        },
    });
}


export const getAllTags = async () => {
    return prisma.post.findMany({
        select: {
            tags: true
        }
    });
};


