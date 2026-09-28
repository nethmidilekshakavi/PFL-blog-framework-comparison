import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { createPost } from "../api/posts";

export default function CreatePost() {
    const navigate = useNavigate();

    const handleCreate = async (data) => {
        const created = await createPost(data);
        navigate(`/posts/${created.id}`);
    };

    return (
        <>
            <div className="section-head" style={{ justifyContent: "center" }}>
                <h2>Write a new post</h2>
            </div>
            <PostForm onSubmit={handleCreate} submitLabel="🚀 Publish post" />
        </>
    );
}
