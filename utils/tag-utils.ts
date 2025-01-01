export const tagsToSlug = (tags: string[]): string => {
    return tags.map(tag => `#${tag}`).join(' ');
};



export const slugToTags = (slug: string): string[] => {
    if (!slug) return [];
    return slug.split(' ')
        .filter(tag => tag.startsWith('#'))
        .map(tag => tag.slice(1));
};


