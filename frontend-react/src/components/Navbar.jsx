import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="container">
                <Link to="/" className="logo">Dev<span>Log</span></Link>
                <nav className="nav-links">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/posts" end>All Posts</NavLink>
                    <NavLink to="/posts/new" className="btn btn-primary">+ New Post</NavLink>
                </nav>
            </div>
        </header>
    );
}
