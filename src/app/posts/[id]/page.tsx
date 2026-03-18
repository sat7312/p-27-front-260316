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

    const onModifySuccess = (id: number, contentValue: string) => {
        if (postComments === null) return;

        //     fetchApi(`/api/v1/${postId}/comments`)
        //         .then(rs) => {
        //              setPostComments(rs);
        //         }

        setPostComments(
            postComments.map((postComment) =>
                postComment.id === id
                    ? { ...postComment, content: contentValue }
                    : postComment
            )
        );
    };

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
                <PostCommentList
                    postId={post.id}
                    postComments={postComments}
                    deletePostComment={deletePostComment}
                    onModifySuccess={onModifySuccess}
                />
            </div>
        </>
    )
}

function PostCommentList({ postId, postComments, deletePostComment, onModifySuccess }: {
    postId: number,
    postComments: PostCommentDto[] | null,
    deletePostComment: (commentId: number) => void
    onModifySuccess: (commentId: number, content: string) => void
}) {
    return (
        <>
            <h2 className="p-2">댓글 목록</h2>

            {postComments === null && <div>로딩중..</div>}
            {postComments !== null && postComments.length === 0 && (
                <div>댓글이 없습니다.</div>
            )}

            {postComments !== null && postComments.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {postComments.map((postComment) => (
                        <PostCommentListItem
                            key={postComment.id}
                            postId={postId}
                            postComment={postComment}
                            deletePostComment={deletePostComment}
                            onModifySuccess={onModifySuccess}
                        />
                    ))}
                </ul>
            )}
        </>
    )
}

function PostCommentListItem({ postId, postComment, deletePostComment, onModifySuccess }: {
    postId: number,
    postComment: PostCommentDto,
    deletePostComment: (commentId: number) => void
    onModifySuccess: (commentId: number, content: string) => void
}) {

    const [modifyMode, setModifyMode] = useState(false);

    const toggleModifyMode = () => {
        setModifyMode(!modifyMode);
    };

    const handleModifySubmit = (e: any) => {
        e.preventDefault();
        const form = e.target;
        const contentInput = form.content;
        const contentValue = contentInput.value;

        fetchApi(`/api/v1/posts/${postId}/comments/${postComment.id}`, {
            method: "PUT",
            body: JSON.stringify({ content: contentValue }),
        }).then((data) => {
            alert(data.msg);
            toggleModifyMode();
        });

        onModifySuccess(postComment.id, contentValue);
    };

    return (
        <li key={postComment.id} className="flex gap-2 items-center">
            <span>{postComment.id} : </span>
            {modifyMode && (
                <form className="flex gap-2" onSubmit={handleModifySubmit}>
                    <input
                        type="text"
                        name="content"
                        defaultValue={postComment.content}
                        className="border-2 p-2 rounded"
                    />
                    <button className="border-2 p-2 rounded" type="submit">
                        저장
                    </button>
                </form>
            )}
            {!modifyMode && <span>{postComment.content}</span>}
            <button className="border-2 p-2 rounded" onClick={toggleModifyMode}>
                {modifyMode ? "수정취소" : "수정"}
            </button>
            <button
                className="border-2 p-2 rounded"
                onClick={() => {
                    deletePostComment(postComment.id);
                }}
            >삭제</button>
        </li>
    )
}