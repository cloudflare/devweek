import { sign } from 'tweetnacl';
import * as blep from './commands/blep';
import * as utils from './utils';

export async function interaction(req: Request): Promise<Response> {
	try {
		// 1. Validating incoming request signature
		// @see https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
		const timestamp = req.headers.get('X-Signature-Timestamp') || '';
		const signature = req.headers.get('X-Signature-Ed25519') || '';
		const rawBody = await req.clone().text();

		const isVerified = sign.detached.verify(
			utils.encode(timestamp + rawBody),
			utils.viaHEX(signature),
			utils.viaHEX(PUBLICKEY),
		);

		if (!isVerified) throw 1;
	} catch (err) {
		return utils.respond(401, 'Invalid request signature');
	}

	try {
		// 2. Determine the interaction type
		// @see https://discord.com/developers/docs/interactions/slash-commands#receiving-an-interaction
		const action = await req.json();

		// PING (required)
		if (action.type == 1) {
			return utils.respond(200, { type: 1 });
		}

		// APP COMMAND(S)
		// TODO: Add your own handler(s) here!
		// TODO: Determine `handler` by matching on command name (aka `action.data.name`)
		// const { user } = action.member;
		// const { name, options=[] } = action.data;
		return await blep.handler(action.data.options);
	} catch (err) {
		return utils.respond(400, 'Error handling interaction');
	}
}
