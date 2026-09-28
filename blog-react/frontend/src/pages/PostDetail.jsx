import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePost, getPost } from "../api/posts";
import TagList from "../components/TagList";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { formatDate, readingTime } from "../util/posts.js";

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        getPost(id).then(setPost).catch((e) => setError(e.message));
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this post permanently?")) return;
        setDeleting(true);
        try {
            await deletePost(id);
            navigate("/posts");
        } catch (e) {
            setError(e.message);
            setDeleting(false);
        }
    };

    if (error) return <ErrorMessage message={error} />;
    if (!post) return <Loader />;

    return (
        <article className="article">
            <Link to="/posts" style={{ color: "var(--muted)" }}>← Back to posts</Link>
            <h1>{post.title}</h1>
            <div className="meta">
                <span>📅 {formatDate(post.createdAt)}</span>
                <span>⏱ {readingTime(post.content)} min read</span>
            </div>
            <div style={{ marginTop: 16 }}>
                <TagList
                    tags={post.tags}
                    onTagClick={(t) => navigate(`/posts?tag=${encodeURIComponent(t)}`)}
                />
            </div>
            <div className="article-body">{post.content}</div>
            <div className="article-actions">
                <Link to={`/posts/${post.id}/edit`} className="btn btn-ghost">✏ Edit</Link>
                <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? "Deleting…" : "🗑 Delete"}
                </button>
            </div>
        </article>
    );
}
