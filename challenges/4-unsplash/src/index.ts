// @see https://unsplash.com/oauth/applications/new
declare const ACCESSKEY: string;

// Apply incoming query parameter(s) onto a new URL instance, if present in source
function forward(source: URLSearchParams, target: URLSearchParams, ...names: string[]) {
	names.forEach(name => {
		let value = source.get(name);
		if (value != null) target.set(name, value);
	});
}

async function handle(req: Request): Promise<Response> {
	const INPUT = new URL(req.url).searchParams;

	// Request a random image from the Unsplash API
	// @see https://unsplash.com/documentation#get-a-random-photo
	const UNSPLASH = new URL('https://api.unsplash.com/photos/random');
	forward(INPUT, UNSPLASH.searchParams, 'orientation', 'content_filter', 'collections', 'username', 'query');

	// TODO: Handle Rate Limiting Error(s)
	// @see https://unsplash.com/documentation#rate-limiting
	const res = await fetch(UNSPLASH.href, {
		method: 'GET',
		headers: {
			'Accept-Version': 'v1',
			'Authorization': `Client-ID ${ACCESSKEY}`,
		}
	});

	const { urls } = await res.json();

	// Pick a size to use via `?size=value`
	// Options: "regular" | "small" | "thumb"
	// Default: "regular"
	let size = INPUT.get('size');

	if (size && /^(regular|small|thumb)$/i.test(size)) {
		size = size.toLowerCase();
	} else {
		size = 'regular';
	}

	// Select the root image address
	const IMAGE = new URL(urls[size]);

	// Apply any imgix global parameters
	// @see https://unsplash.com/documentation#supported-parameters
	// @example https://<worker url>?orientation=landscape&size=small&fm=webp
	forward(INPUT, IMAGE.searchParams, 'w', 'h', 'crop', 'fm', 'auto', 'q', 'fit', 'dpr');

	return Response.redirect(IMAGE.href, 302);

	// For CORS programmatic requests:
	// return new Response(null, {
	// 	status: 302,
	// 	headers: {
	// 		'Location': IMAGE.href,
	// 		'Access-Control-Max-Age': '86400',
	// 		'Access-Control-Allow-Origin': '*',
	// 		'Access-Control-Allow-Methods': 'GET',
	// 	}
	// });
}

addEventListener('fetch', event => {
	event.respondWith(
		handle(event.request)
	);
});
