export type TaskParams = {
    prompt: string,
    negativePrompt: string,
    style: string,
    resolution: string,
    seed: number
}


export interface PostMeta {
    id: number,
    slug: string,
    title: string,
    description: string,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
    numberOfWords: number
}


export interface PostProps extends PostMeta {
    body: string
}