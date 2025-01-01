import React from 'react'
import { notFound } from "next/navigation";
import { selectBySlug } from "@/libs/post-service";
import { PostProps } from "@/type/type";
import { Tag } from '@/components/tag';
import { MDXRemote } from 'next-mdx-remote/rsc'
import Head from 'next/head';


export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;

    const post: PostProps | null = await selectBySlug(decodeURIComponent(slug));
    if (!post) {
        notFound();
    }
    return (
        <>
            <Head>
                <title>{post.title}</title>
                <meta name="description" content={post.description} />
            </Head>

            <div className="flex flex-col gap-16 text-[#1a2a3a] bg-[#dddddd] px-8 py-8">

                <h1 className="text-4xl font-bold">
                    {post.title}
                </h1>
                <div className="text-lg mb-4">
                    <span>发布于：{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="mx-4">·</span>
                    <span>修改于：{new Date(post.updatedAt).toLocaleDateString()}</span>
                    <span className="mx-4">·</span>
                    <span>字数：{post.numberOfWords}</span>
                </div>

                {post.tags.length > 0 && (
                    <div className="flex text-lg items-center flex-wrap gap-2">
                        <span>标签：</span>
                        {post.tags.map(tag => (
                            <Tag key={tag} tag={tag} size="large" />
                        ))}
                    </div>
                )}

                <article className="prose text-2xl">
                    <MDXRemote source = { post.body } />
                </article>
            </div>
        </>
    );
}




