<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();

	const path = $derived(page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>DevLog</title>
</svelte:head>

<header class="navbar">
	<div class="container">
		<a href="/" class="logo">Dev<span>Log</span></a>
		<nav class="nav-links">
			<a href="/" class:active={path === '/'}>Home</a>
			<a href="/posts" class:active={path === '/posts'}>All Posts</a>
			<a href="/new-post" class="btn btn-primary">+ New Post</a>
		</nav>
	</div>
</header>

<main class="container page">
	{@render children()}
</main>

<footer class="footer">© 2026 DevLog · Built with SvelteKit + Express/SQLite</footer>
