import * as views from './views';
import * as twilio from './twilio';
import * as database from './database';
import * as utils from './utils';

// The account's verified phone number
// NOTE:
//   Trial accounts can only interact with the
//   phone number that you verified for the account.
declare const TEST_RECIPIENT: string;

async function handle(req: Request): Promise<Response> {
	const { method, url } = req;
	const { pathname } = new URL(url);

	/**
	 * GET /
	 * render homepage with form
	 */
	if (method === 'GET' && pathname === '/') {
		return utils.render(views.welcome);
	}

	/**
	 * POST /login
	 * Begin/Wakeup the SMS workflow
	 */
	if (method === 'POST' && pathname === '/login') {
		const input = await req.text();

		let phone = new URLSearchParams(input).get('phone');
		if (!phone) return utils.error(400, 'A phone number is required');

		phone = utils.toE164(phone);
		let { country } = req.cf;

		// TODO: Support other countries
		// Requires Twilio account configuration
		if (country !== 'US') {
			return utils.error(403, 'This demo only supports US phone numbers');
		}

		if (phone[1] !== '1' || phone.length < 12) {
			phone = '+1' + phone.substring(1);
		}

		if (!utils.isE164(phone)) {
			return utils.error(422, 'Invalid phone number');
		}

		let info = await twilio.lookup(phone, country);
		if (!info.ok) return info;

		let data = await info.json();
		country = data.country_code as string;
		phone = data.phone_number as string;

		let key = database.toKey(phone, country);
		let text = await database.load(key).then(database.display);
		await twilio.sms(phone, text);

		return utils.render(views.sent);
	}

	/**
	 * POST /webhook
	 * Receive SMS Message events from Twilio
	 * @NOTE Route is configured via Twilio Console
	 */
	if (method === 'POST' && pathname === '/webhook') {
		const input = await req.text();
		if (!input) return utils.error(400, 'Missing parameters');

		const signature = req.headers.get('X-Twilio-Signature');
		if (!signature) return utils.error(400, 'Missing Twilio signature');

		const params = new URLSearchParams(input);
		const repro = await twilio.sign(req.url, params);
		if (repro !== signature) return utils.error(400, 'Invalid signature');

		const phone = (params.get('From') || '').trim();
		if (!phone) return utils.error(400, 'Missing "From" parameter');
		if (!utils.isE164(phone)) return utils.error(400, 'Invalid "From" parameter');

		const country = (params.get('FromCountry') || '').trim();
		if (!country) return utils.error(400, 'Missing "FromCountry" parameter');

		const Body = (params.get('Body') || '').trim();
		if (!Body) return utils.error(400, 'Missing message text');

		const [cmd, ...rest] = Body.split(/\s+/);
		const KEY = database.toKey(phone, country);
		const command = cmd.toUpperCase();

		if (command === 'LIST') {
			let items = await database.load(KEY);
			return new Response(database.display(items));
		}

		if (command === 'NEW') {
			let list = await database.load(KEY);

			list.push({
				id: list.length + 1,
				text: rest.join(' '),
			});

			await database.save(KEY, list);

			let text = list.length + ' reminder' + (list.length === 1 ? '' : 's');
			return new Response(`Added new reminder!\n\nYou now have ${text}.`);
		}

		if (command === 'DONE') {
			let target = Number(rest.shift());
			let list = await database.load(KEY);

			for (let i=0; i < list.length; i++) {
				if (list[i].id === target) {
					list.splice(i, 1);
					break;
				}
			}

			await database.save(KEY, list);

			let text = list.length + ' reminder' + (list.length === 1 ? '' : 's');
			return new Response(`Removed reminder!\n\nYou now have ${text} remaining.`);
		}

		return utils.error(404, `Unknown "${command}" command`);
	}

	return utils.error(404, 'Page Not Found');
}

addEventListener('fetch', event => {
	event.respondWith(
		handle(event.request)
	);
});

addEventListener('scheduled', event => {
	event.waitUntil(
		// NOTE:
		//  With a trial account, only the
		//  account's verified phone number can interact
		//  with Twilio SMS messages.
		// TODO:
		//  Insert your number OR iterate over all KV entries.
		database.load(
			database.toKey(TEST_RECIPIENT, 'US')
		).then(async arr => {
			let text = 'Good morning!\n' + database.display(arr);
			if (arr.length) await twilio.sms(TEST_RECIPIENT, text);
			return new Response('OK');
		})
	);
});
