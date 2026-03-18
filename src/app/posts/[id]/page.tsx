"use client"

import { fetchApi } from "@/lib/client";
import { PostDto } from "@/type/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Detail() {

    const [post, setPost] = useState<PostDto | null>(null);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        fetchApi(`/api/v1/posts/${id}`)
            .then(data => setPost(data));
    }, []);

    const onDeleteHandler = (id: number) => {
        fetchApi(`/api/v1/posts/${id}`, {
            method: "DELETE"
        })
            .then((rs) => {
                alert("삭제가 완료되었습니다.");
                router.replace("/posts");
            })
    }

    if (post === null) return (<div>로딩중..</div>)
    return (
        <>
            <div className="flex flex-col gap-8 items-center">
                <h1>{id}번 글 상세페이지</h1>
                <div>
                    <h1>{post.title}</h1>
                    <div>{post.content}</div>
                </div>
                <div>
                    <button
                        onClick={() => {
                            onDeleteHandler(post.id);
                        }}
                        className="border-1 rounded p-2 bg-red-500"
                    >삭제</button>
                </div>
            </div>
        </>
    )
}