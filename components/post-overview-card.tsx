import React from 'react';
import Link from 'next/link'
import { PostMeta } from "@/type/type";


export function PostOverviewCard({ postMeta }: { postMeta: PostMeta }) {
    return (
        <Link
            href={`/posts/${encodeURIComponent(postMeta.slug)}`}
            className="block p-8 w-full bg-gray-200 flex flex-col gap-6"
            passHref
        >
            <div className="w-full relative">
                <img
                    src={`/posts-images/${postMeta.slug}/cover.jpg`}
                    alt={postMeta.title}
                    className="w-full h-auto rounded-md"
                />
            </div>

            <div>
                <h3 className="text-3xl text-[#1a2a3a] break-words mb-2">
                    {postMeta.title}
                </h3>
                <p className="text-lg text-[#1a2a3a] mb-1.5">
                    发布于：{new Date(postMeta.createdAt).toLocaleDateString()}  ·
                    修改于：{new Date(postMeta.updatedAt).toLocaleDateString()}  ·
                    字数：{postMeta.numberOfWords}
                </p>
                <h3 className="text-2xl text-[#1a2a3a] break-words">
                    {postMeta.description}
                </h3>
            </div>
        </Link>
    );
}

