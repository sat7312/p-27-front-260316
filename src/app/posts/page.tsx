"use client";

import { PostDto } from "@/type/post";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
    const [posts, setPosts] = useState<PostDto[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setPosts(data);
            });
    }, []);

    return (
        posts.length <= 0
            ? <div>로딩중..</div>
            : <ul>
                {posts.map((post) => (
                    <li key={post.id} className="p-2">
                        <Link href={`/posts/${post.id}`}>{post.id}. {post.title}</Link>
                    </li>
                ))}
            </ul>
    )
}