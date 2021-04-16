import * as setup from './setup';
import { interaction } from './receive';
import * as utils from './utils';

declare global {
	// @see https://discord.com/developers/applications
	const CLIENT_ID: string;
	const CLIENT_SECRET: string;
	const PUBLICKEY: string;

	// Our KV Namespace
	const ANIMALS: KVNamespace;

	// Discord struct(s)
	interface Option {
		name: string;
		value: unknown;
	}
}

async function handler(req: Request): Promise<Response> {
	const { pathname } = new URL(req.url);

	// Receiving a Discord user's slash command
	if (req.method === 'POST' && pathname === '/interaction') {
		return interaction(req);
	}

	// Redirect for App setup/authorization
	// IMPORTANT: You must call this manually, including after App updates!
	// NOTE: You can remove this after installation
	if (req.method === 'GET' && pathname === '/') {
		return setup.authorize();
	}

	// Add and/or update the App's command definitions
	// IMPORTANT: You must call this manually, including after App updates!
	// NOTE: You can remove this after installation
	if (req.method === 'GET' && pathname === '/setup') {
		return setup.commands();
	}

	return utils.respond(400, 'Unknown Request');
}

addEventListener('fetch', event => {
	event.respondWith(
		handler(event.request)
	);
});
