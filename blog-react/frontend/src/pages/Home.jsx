import { Link, useNavigate } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import TagList from "../components/TagList";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { getAllTags, getLatest } from "../util/posts.js";

export default function Home() {
    const { posts, loading, error, reload } = usePosts();
    const navigate = useNavigate();

    return (
        <>
            <section className="hero">
                <h1>Share your <span>Final Year Project</span> journey</h1>
                <p>
                    A blog for Software Engineering students to present ideas, document progress
                    and discuss what they learned building their final projects.
                </p>
                <div className="hero-actions">
                    <Link to="/posts/new" className="btn btn-primary">✍ Write a post</Link>
                    <Link to="/posts" className="btn btn-ghost">Browse all posts</Link>
                </div>
            </section>

            {loading && <Loader />}
            {error && <ErrorMessage message={error} onRetry={reload} />}

            {!loading && !error && (
                <>
                    <div className="section-head">
                        <h2>Latest posts</h2>
                        <Link to="/posts">View all →</Link>
                    </div>

                    {posts.length === 0 ? (
                        <div className="state">No posts yet. Be the first to write one!</div>
                    ) : (
                        <div className="grid">
                            {getLatest(posts, 3).map((p) => <PostCard key={p.id} post={p} />)}
                        </div>
                    )}

                    <div className="section-head">
                        <h2>Popular topics</h2>
                    </div>
                    <TagList
                        tags={getAllTags(posts).slice(0, 12)}
                        onTagClick={(tag) => navigate(`/posts?tag=${encodeURIComponent(tag)}`)}
                    />
                </>
            )}
        </>
    );
}
