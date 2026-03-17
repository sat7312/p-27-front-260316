"use client";

import { useEffect, useState } from "react";

export interface Post {
    id: number,
    title: string,
    content: string
}

export default function Home() {
    const [posts, setPosts] = useState<Post []>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/posts")
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
                        {post.id} : {post.title}
                    </li>
                ))}
            </ul >
    )
}