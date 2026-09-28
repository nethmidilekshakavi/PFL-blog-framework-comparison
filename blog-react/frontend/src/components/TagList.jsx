export default function TagList({ tags = [], onTagClick, activeTag }) {
    return (
        <div className="tags">
            {tags.map((t) => {
                const name = typeof t === "string" ? t : t.tag;
                const count = typeof t === "string" ? null : t.count;
                return (
                    <span
                        key={name}
                        className={`tag ${activeTag === name ? "active" : ""}`}
                        onClick={onTagClick ? () => onTagClick(name) : undefined}
                    >
            #{name}{count != null && <small>{count}</small>}
          </span>
                );
            })}
        </div>
    );
}
