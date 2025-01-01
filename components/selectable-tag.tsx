"use client"

import { useRouter } from 'next/navigation';
import { tagsToSlug } from '@/utils/tag-utils';


export function SelectableTag({ tag, selectedTags }: { tag: string, selectedTags: string[] }) {
    const router = useRouter();
    const isSelected = selectedTags.includes(tag);

    const handleToggle = () => {
        let newTags: string[];
        if (isSelected) {
            newTags = selectedTags.filter(t => t !== tag);
        } else {
            newTags = [...selectedTags, tag];
        }
        const newSlug = newTags.length > 0 ? tagsToSlug(newTags) : '';
        router.push(`/tags/${encodeURIComponent(newSlug)}`);
    };

    return (
        <button
            onClick={handleToggle}
            className={`
                px-2 py-1 rounded-lg text-2xl
                ${isSelected
                ? 'bg-[#2a3a4a] text-[#dddddd] font-bold'
                : ''}
            `}
        >
            #{tag}
        </button>
    );
}