import { selectAll, getAllTags, selectByTags } from '@/libs/post-service';
import { PostMeta } from "@/type/type";
import { notFound } from "next/navigation";
import { slugToTags } from '@/utils/tag-utils';
import { SelectableTag } from '@/components/selectable-tag';
import { PostOverviewCard } from '@/components/post-overview-card';
import Head from 'next/head';
import React from "react";



export default async function TagPage({ params }: { params: Promise<{ slug: string[] | undefined }> }) {

    let posts: PostMeta[];
    let selectedTags: string[];

    const { slug } = await params;
    if (!slug) {
        selectedTags = [];
    } else if(slug.length > 1) {
        notFound();
    } else {
        selectedTags = slugToTags(decodeURIComponent(slug[0]));
    }

    if(selectedTags.length > 0) {
        posts = await selectByTags(selectedTags);
    } else {
        posts = await selectAll();
    }

    const tagsOfPosts:  { tags: string[] }[] = await getAllTags();

    const uniqueTags = [...new Set(tagsOfPosts.flatMap(post => post.tags))];

    const title = `文章标签：${uniqueTags.join(", ")}`;
    const description = `已选标签：${selectedTags.join(", ")}`;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Head>

            <div className="flex flex-col gap-16">

                <div className="text-[#1a2a3a] text-2xl">
                    选择标签过滤文章
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uniqueTags.map((tag) => (
                        <SelectableTag
                            key={tag}
                            tag={tag}
                            selectedTags={selectedTags}
                        />
                    ))}
                </div>

                <h2 className="text-lg text-[#1a2a3a]">
                    {selectedTags.length > 0
                        ? `找到 ${posts.length} 篇相关文章`
                        : ``}
                </h2>

                <div className="grid grid-cols-1 gap-6">
                    {posts.map((post) => (
                        <div key={post.slug}>
                            <PostOverviewCard postMeta={post}/>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );

}