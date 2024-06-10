"use client";

import {Post} from "@/app/post/action";

export const PostComponent = ({ post }: { post?: Post }) => {
  return (
    <div className="bg-neutral-100 p-4 rounded-md m-4 max-w-prose flex flex-col items-center justify-between gap-2 w-full">
      <p className={"text-2xl"}>{post?.post?.tittle}</p>
        <div className={"flex flex-col gap-5"}>
            <div>Content: {post?.post?.content}</div>
            <div>{post?.post?.callToAction}</div>
        </div>
        <div className={"flex flex-wrap gap-2"}>{post?.post?.tags?.map(tags => {
            return <div key={tags} className={"p-2 bg-gray-600 text-gray-100 rounded-2xl"}>{tags}</div>
        })}</div>
    </div>
  );
};
