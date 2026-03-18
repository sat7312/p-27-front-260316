"use client"

import { fetchApi } from "@/lib/client";
import { PostCommentDto, PostDto } from "@/type/post";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Detail() {

    const [post, setPost] = useState<PostDto | null>(null);
    const [postComments, setPostComments] = useState<PostCommentDto[] | null>(null);
    const [isError, setIsError] = useState(false);
    const { id: postId } = useParams();
    const router = useRouter();

    useEffect(() => {
        fetchApi(`/api/v1/posts/${postId}`)
            .then(setPost)
            .catch((e) => {
                console.log(e);
                setIsError(true);
            })

        fetchApi(`/api/v1/posts/${postId}/comments`)
            .then(setPostComments);
    }, []);

    const onDeleteHandler = (postId: number) => {
        fetchApi(`/api/v1/posts/${postId}`, {
            method: "DELETE"
        })
            .then((rs) => {
                alert("삭제가 완료되었습니다.");
                router.replace("/posts");
            })
    }

    const deletePostComment = (commentId: number) => {
        fetchApi(`/api/v1/posts/${postId}/comments/${commentId}`, {
            method: "DELETE",
        })
            .then((data) => {
                alert(data.msg);
            
                if (postComments === null) return;

                // 리렌더링을 위한 댓글 배열 교체 필요
                setPostComments(
                    postComments.filter((postComment) => postComment.id !== commentId)
                );
            });
    }

    if (isError) return <div>문제 발생</div>
    if (post === null) return <div>로딩중..</div>

    return (
        <>
            <div className="flex flex-col gap-8 items-center">
                <h1>{postId}번 글 상세페이지</h1>
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
                    <ul className="flex flex-col gap-2">
                        {postComments.map((postComment) => (
                            <li key={postComment.id} className="flex gap-2 items-center">
                                <span>{postComment.id} : </span>
                                <span>{postComment.content}</span>
                                <button className="border-2 p-2 rounded">수정</button>
                                <button
                                    className="border-2 p-2 rounded"
                                    onClick={() => {
                                        deletePostComment(postComment.id);
                                    }}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}