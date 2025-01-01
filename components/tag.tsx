import Link from 'next/link';



type TagSize = 'small' | 'medium' | 'large';

interface TagProps {
    tag: string;
    size?: TagSize;
}

export function Tag({ tag, size = 'medium' }: TagProps) {
    const sizeStyles = {
        small: 'text-sm px-2 py-1',
        medium: 'text-base px-3 py-1.5',
        large: 'text-lg px-4 py-2'
    };

    return (
        <Link
            href={`/tags/${encodeURIComponent(`#${tag}`)}`}
            className={`
                inline-flex items-center
                ${sizeStyles[size]}
                text-[#1a2a3a]
                underline
                font-bold
                px-2
            `}
        >
            #{tag}
        </Link>
    );
}
