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

<div class="shell">
	<header class="navbar">
		<div class="navbar-inner">
			<a href="/" class="logo">Dev<span>Log</span></a>
			<nav class="nav-links">
				<a href="/" class:active={path === '/'}>Home</a>
				<a href="/posts" class:active={path === '/posts'}>All Posts</a>
				<a href="/new-post" class="nav-cta">+ New Post</a>
			</nav>
		</div>
	</header>

	<div class="content">
		{@render children()}
	</div>

	<footer class="footer">© 2026 DevLog · Built with SvelteKit + Express/SQLite</footer>
</div>
