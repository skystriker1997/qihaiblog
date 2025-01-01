import React from 'react';
import Link from 'next/link'
import { PostMeta } from "@/type/type";


export function PostOverviewCard({ postMeta }: { postMeta: PostMeta }) {
    return (
        <Link href={`/posts/${encodeURIComponent(postMeta.slug)}`} className="block p-8 max-w-lg w-full bg-[#dddddd]"
              passHref>
            <h3 className="text-2xl text-[1a2a3a] break-words mb-2 font-bold">
                {postMeta.title}
            </h3>

            <p className="text-lg text-[#1a2a3a] mb-1.5">
                发布于：{new Date(postMeta.createdAt).toLocaleDateString()}  ·  修改于：{new Date(postMeta.updatedAt).toLocaleDateString()}  ·  字数：{postMeta.numberOfWords}
            </p>

            <h3 className="text-xl text-[#1a2a3a] break-words">
                概述：{postMeta.description}
            </h3>
        </Link>
    );
}

