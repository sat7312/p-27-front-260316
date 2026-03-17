"use client"

import { PostDto } from "@/type/post";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

    const [post, setPost] = useState<PostDto | null>(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/posts/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setPost(data);
            });
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