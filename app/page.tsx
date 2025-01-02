"use client"

import Link from 'next/link';
import { openingWords } from "@/special_pin/opening-words";
import { PostMeta } from "@/type/type";
import { PostOverviewCard } from "@/components/post-overview-card";
import Image from "next/image";
import React from "react";
import { ReactTyped } from "react-typed";


export default function Home() {

    return (
        <main>
            <div className="flex flex-col gap-16">
                <div className="bg-gray-200 text-[#1a2a3a] text-2xl text-center py-8">
                    欢迎来到岐海乡民的空间，<br/><br/>
                    这里是我的文库，<br/><br/>提供免费的生成式ai应用
                </div>

                <div className="grid grid-rows-2 gap-4">
                    <Link
                        href="/tags"
                        className="px-6 py-3 rounded-lg bg-[#1a2a3a] text-[#dddddd] text-center text-lg"
                    >
                        查看所有文章
                    </Link>
                    <Link
                        href="/t2i"
                        className="px-6 py-3 rounded-lg bg-[#1a2a3a] text-[#dddddd] text-center text-lg"
                    >
                        免费ai生图
                    </Link>
                </div>

                <div>
                    <div className="mb-8">
                        <Image
                            src="push-pin.svg"
                            alt="push-pin"
                            width={32}
                            height={32}
                            className="inline"
                        />
                        <span className="text-[#1a2a3a] text-2xl"> 置顶文章</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div key={openingWords.slug}>
                            <PostOverviewCard postMeta={openingWords}/>
                        </div>
                    </div>
                </div>

            </div>
        </main>

    );
}
