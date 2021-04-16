import * as utils from './utils';
import * as blep from './commands/blep';

/**
 * Redirect to an App Authorization screen
 * @IMPORTANT One must authorize this App manually!
 * @NOTE This route may be removed from the Worker Script once authorized.
 * @see https://discord.com/developers/docs/interactions/slash-commands#authorizing-your-application
 * @see https://discord.com/developers/docs/topics/oauth2
 */
export function authorize(): Response {
	const target = new URL('https://discord.com/api/oauth2/authorize');
	target.searchParams.set('scope', 'applications.commands');
	target.searchParams.set('client_id', CLIENT_ID);
	return Response.redirect(target.href, 302);
}

/**
 * Add/Synchronize Slash Commands for the Application.
 * @NOTE Discord requires 1 hour to reflect command changes.
 * @see https://discord.com/developers/docs/interactions/slash-commands#bulk-overwrite-global-application-commands
 */
export async function commands(): Promise<Response> {
	try {
		// 1. Exchange client credentials for `Bearer` token
		// @see https://discord.com/developers/docs/topics/oauth2
		const res = await fetch('https://discord.com/api/v6/oauth2/token', {
			method: 'POST',
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				scope: 'applications.commands.update',
			}),
			headers: {
				'Authorization': `Basic ${btoa(CLIENT_ID + ':' + CLIENT_SECRET)}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		const data = await res.json();
		var token = `Bearer ${data.access_token}`;
	} catch (err) {
		return utils.respond(400, 'Error fetching Authorization token');
	}

	try {
		// 2. Bulk Overwrite Application Commands!
		const res = await fetch(`https://discord.com/api/v8/applications/${CLIENT_ID}/commands`, {
			method: 'PUT',
			headers: {
				'Authorization': token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([
				await blep.command()
			])
		});

		if (res.ok) {
			return utils.respond(200, 'OK');
		}

		return utils.respond(400, 'Error synchronizing command definition(s)');
	} catch (err) {
		return utils.respond(400, 'Error initializing request');
	}
}
