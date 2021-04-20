// @see wranger.toml
declare const LOCALE_DEFAULT: string;

async function handle(req: Request): Promise<Response> {
	const lang = req.headers.get('Accept-Language');
	const locale = lang && lang.split(',')[0] || LOCALE_DEFAULT;

	const timeZone = req.cf.timezone; // eg "America/New_York"

	const localtime = new Date(
		new Date().toLocaleString(undefined, { timeZone })
	);

	const hour = localtime.getHours();

	// Morning vs Afternoon vs Night
	let image='', label='', source='';

	if (hour >= 5 && hour < 12) {
		label = 'Morning';
		source = 'https://unsplash.com/photos/-G3rw6Y02D0';
		image = 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80';
	} else if (hour >= 12 && hour < 18) {
		label = 'Afternoon';
		source = 'https://unsplash.com/photos/PXQkzW7HbM4';
		image = 'https://images.unsplash.com/photo-1581205445756-15c1d2e9a8df?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3272&q=80';
	} else {
		label = 'Night';
		source = 'https://unsplash.com/photos/Z5ARQ6WNEqA';
		image = 'https://images.unsplash.com/photo-1591554338378-6dcc422b8249?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2250&q=80';
	}

	const res = await fetch('https://example.com');
	const rewriter = new HTMLRewriter;

	rewriter.on('head', {
		element(elem) {
			elem.append(`
				<style>
					body {
						display: flex;
						align-items: flex-start;
						background: transparent url(${image}) no-repeat center;
						background-size: cover;
						height: 100vh;
					}
					div {
						background-color: rgba(255, 255, 255, 0.7);
						text-align: center;
					}
					p {
						font-size: 1.4rem;
						text-align: center;
					}
					time {
						font-variant-numeric: tabular-nums;
						font-weight: bold;
					}
					cite {
						display: block;
						margin-top: 2rem;
						text-align: right;
						font-size: 0.8rem;
					}
				</style>
			`, {
				html: true
			});
		}
	})

	rewriter.on('body', {
		element(elem) {
			elem.setInnerContent(`
				<div>
					<h1>Good ${label}!</h1>
					<p>
						It is currently
						<time datetime="${localtime.toISOString()}">
							${localtime.toLocaleTimeString(locale, {
								hour: '2-digit', minute: '2-digit'
							})}
						</time>
					</p>
					<cite>Image via <a href="${source}">Unsplash</a></cite>
				</div>
			`, {
				html: true
			});
		}
	});

	return rewriter.transform(res);
}

addEventListener('fetch', event => {
	event.respondWith(
		handle(event.request)
	);
});
