import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { getPost, updatePost } from "../api/posts";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getPost(id).then(setPost).catch((e) => setError(e.message));
    }, [id]);

    if (error) return <ErrorMessage message={error} />;
    if (!post) return <Loader />;

    const handleUpdate = async (data) => {
        await updatePost(id, data);
        navigate(`/posts/${id}`);
    };

    return (
        <>
            <div className="section-head" style={{ justifyContent: "center" }}>
                <h2>Edit post</h2>
            </div>
            <PostForm initial={post} onSubmit={handleUpdate} submitLabel="💾 Save changes" />
        </>
    );
}
