"use client"

import { fetchApi } from "@/lib/client";
import { PostCommentDto, PostDto } from "@/type/post";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Detail() {

    const [post, setPost] = useState<PostDto | null>(null);
    const [postComments, setPostComments] = useState<PostCommentDto[] | null>(null);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        fetchApi(`/api/v1/posts/${id}`)
            .then(data => setPost(data));

        fetchApi(`/api/v1/posts/${id}/comments`)
            .then(setPostComments);
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
                <div className="flex gap-2">
                    <Link
                        href={`/posts/${post.id}/edit`}
                        className="border-1 rounded p-2 bg-blue-500">수정</Link>
                    <button
                        onClick={() => {
                            onDeleteHandler(post.id);
                        }}
                        className="border-1 rounded p-2 bg-red-500"
                    >삭제</button>
                </div>

                <h2 className="p-2">댓글 목록</h2>
                {postComments === null && <div>로딩중..</div>}
                {postComments !== null && postComments.length === 0 && (
                    <div>댓글이 없습니다.</div>
                )}

                {postComments !== null && postComments.length > 0 && (
                    <ul>
                        {postComments.map((postComment) => (
                            <li key={postComment.id}>
                                {postComment.id} : {postComment.content}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}