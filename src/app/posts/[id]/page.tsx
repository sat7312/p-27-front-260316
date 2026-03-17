"use client"

import { fetchApi } from "@/lib/client";
import { PostDto } from "@/type/post";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Detail() {

    const [post, setPost] = useState<PostDto | null>(null);
    const { id } = useParams();

    useEffect(() => {
        fetchApi(`/api/v1/posts/${id}`)
            .then(data => setPost(data));
    }, []);

    if (post === null) return (<div>로딩중..</div>)
    return (
        <>
            <div className="flex flex-col gap-8 items-center">
                <h1>{id}번 글 상세페이지</h1>
                <div>
                    <h1>{post?.title}</h1>
                    <div>{post?.content}</div>
                </div>
            </div>
        </>
    )
}