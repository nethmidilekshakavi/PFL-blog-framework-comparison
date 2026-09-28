export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="state error">
            <p>⚠ Could not reach the server: {message}</p>
            <p style={{ margin: "8px 0 16px" }}>Is the backend running on port 3001?</p>
            {onRetry && <button className="btn btn-ghost" onClick={onRetry}>Try again</button>}
        </div>
    );
}   
