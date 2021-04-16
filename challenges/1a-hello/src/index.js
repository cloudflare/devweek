import { template } from './template';

addEventListener('fetch', event => {
	event.respondWith(
		handleRequest(event.request).catch(err => {
			return new Response(err.stack || 'Unknown Error', {
				status: 500
			});
		})
	);
});

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
	const html = template(request.cf);
	return new Response(html, {
		status: 200,
		headers: {
			'content-type': 'text/html;charset=utf8'
		},
	});
}
