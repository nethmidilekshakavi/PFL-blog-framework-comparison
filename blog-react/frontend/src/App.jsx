import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

function NotFound() {
    return (
        <div className="state">
            <h2>404 - Page not found</h2>
            <p style={{ margin: "10px 0 20px" }}>That page doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Back home</Link>
        </div>
    );
}

export default function App() {
    return (
        <>
            <Navbar />
            <main className="container page">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/new" element={<CreatePost />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/posts/:id/edit" element={<EditPost />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <footer className="footer">© 2026 DevLog · Built with React + json-server</footer>
        </>
    );
}
