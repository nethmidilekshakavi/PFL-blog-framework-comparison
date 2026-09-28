import { Link } from "react-router-dom";
import TagList from "./TagList";
import { excerpt, formatDate, readingTime } from "../util/posts.js";

export default function PostCard({ post }) {
    return (
        <article className="card">
            <div className="meta">
                <span>📅 {formatDate(post.createdAt)}</span>
                <span>⏱ {readingTime(post.content)} min read</span>
            </div>
            <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
            <p>{excerpt(post.content)}</p>
            <TagList tags={post.tags} />
        </article>
    );
}
