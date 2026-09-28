import { useSearchParams } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import TagList from "../components/TagList";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { filterPosts, getAllTags, sortNewest } from "../util/posts.js";

export default function Posts() {
    const { posts, loading, error, reload } = usePosts();
    const [params, setParams] = useSearchParams();
    const query = params.get("q") ?? "";
    const tag = params.get("tag") ?? "";

    const update = (key, value) => {
        const next = new URLSearchParams(params);
        value ? next.set(key, value) : next.delete(key);
        setParams(next, { replace: true });
    };

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} onRetry={reload} />;

    const results = sortNewest(filterPosts(posts, { query, tag }));

    return (
        <>
            <div className="section-head">
                <h2>All posts ({results.length})</h2>
            </div>

            <div className="toolbar">
                <input
                    className="input"
                    placeholder="🔍 Search title or content…"
                    value={query}
                    onChange={(e) => update("q", e.target.value)}
                />
                {tag && (
                    <button className="btn btn-ghost" onClick={() => update("tag", "")}>
                        Clear tag #{tag} ✕
                    </button>
                )}
            </div>

            <div style={{ marginBottom: 26 }}>
                <TagList
                    tags={getAllTags(posts)}
                    activeTag={tag}
                    onTagClick={(t) => update("tag", t === tag ? "" : t)}
                />
            </div>

            {results.length === 0 ? (
                <div className="state">No posts match your search.</div>
            ) : (
                <div className="grid">
                    {results.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
            )}
        </>
    );
}
