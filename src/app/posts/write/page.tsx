"use client"

export default function Write() {

    const onSubmitHandler = (e: any) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title;
        const content = form.content;

        if (title.value.length === 0) {
            alert("제목을 입력해주세요.");
            title.focus();
            return;
        }

        if (content.value.length === 0) {
            alert("내용을 입력해주세요.");
            content.focus();
            return;
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4 items-center">
                <h1>글 작성</h1>

                <form action="" onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                    <input type="text" name="title" className="border-1 rounded p-2" placeholder="제목을 입력해주세요" />
                    <textarea rows={10} name="content" className="border-1 rounded p-2" placeholder="내용을 입력해주세요"></textarea>
                    <input type="submit" value="작성" className="border-1 rounded p-2" />
                </form>
            </div>
        </>
    )
}