import { useState } from "react";
import TagList from "./TagList";
import { parseTags } from "../util/posts.js";

export default function PostForm({ initial, onSubmit, submitLabel = "Publish" }) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [content, setContent] = useState(initial?.content ?? "");
    const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const validate = () => {
        const e = {};
        if (title.trim().length < 3) e.title = "Title must be at least 3 characters.";
        if (content.trim().length < 20) e.content = "Content must be at least 20 characters.";
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        setSaving(true);
        setSubmitError("");
        try {
            await onSubmit({
                title: title.trim(),
                content: content.trim(),
                tags: parseTags(tagsInput),
            });
        } catch (err) {
            setSubmitError(err.message);
            setSaving(false);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
                <label htmlFor="title">Title</label>
                <input id="title" className="input" value={title}
                       onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Building my FYP with React" />
                {errors.title && <p className="error-text">{errors.title}</p>}
            </div>

            <div className="field">
                <label htmlFor="content">Content</label>
                <textarea id="content" className="textarea" value={content}
                          onChange={(e) => setContent(e.target.value)} placeholder="Tell us about your project…" />
                {errors.content && <p className="error-text">{errors.content}</p>}
            </div>

            <div className="field">
                <label htmlFor="tags">Tags</label>
                <input id="tags" className="input" value={tagsInput}
                       onChange={(e) => setTagsInput(e.target.value)} placeholder="react, api, testing" />
                <p className="hint">Separate tags with commas.</p>
                <div style={{ marginTop: 10 }}><TagList tags={parseTags(tagsInput)} /></div>
            </div>

            {submitError && <p className="error-text">⚠ {submitError}</p>}

            <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : submitLabel}
            </button>
        </form>
    );
}
