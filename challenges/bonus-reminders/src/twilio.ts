import * as utils from './utils';

// @see https://www.twilio.com/console
declare const TWILIO_PHONENUMBER: string;
declare const TWILIO_ACCOUNTSID: string;
declare const TWILIO_AUTHTOKEN: string;

// Prepare HTTP request values for the Twilio API
// @see https://www.twilio.com/docs/usage/api#working-with-twilios-apis
const Authorization = `Basic ${btoa(TWILIO_ACCOUNTSID + ':' + TWILIO_AUTHTOKEN)}`;

// @see twilio.com/docs/sms/send-messages
export function sms(phone: string, message: string) {
	const data = new URLSearchParams;
	data.set('From', TWILIO_PHONENUMBER);
	data.set('To', utils.toE164(phone)); //=> +1234567890
	data.set('Body', message);

	// @see https://www.twilio.com/docs/sms/api#base-url
	return fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNTSID}/Messages.json`, {
		headers: { Authorization },
		method: 'POST',
		body: data
	});
}

// @see https://www.twilio.com/docs/lookup/api#api-url
export function lookup(phone: string, country?: string) {
	let url = `https://lookups.twilio.com/v1/PhoneNumbers/${phone}`;
	if (country) url += `?CountryCode=${country}`;

	return fetch(url, {
		headers: { Authorization },
		method: 'GET',
	});
}

// Replicate the signing process
// @see https://www.twilio.com/docs/usage/security#validating-requests
export async function sign(url: string, params: URLSearchParams) {
	const Encoder = new TextEncoder;
	const keydata = Encoder.encode(TWILIO_AUTHTOKEN);

	const HMAC: HmacKeyGenParams = { name: 'HMAC', hash: 'SHA-1' };
	const key = await crypto.subtle.importKey('raw', keydata, HMAC, false, ['sign']);

	params.sort();
	let value = url;
	for (let [k, v] of params) {
		value += k + v;
	}

	const signature = await crypto.subtle.sign(HMAC, key, Encoder.encode(value));

	return btoa(
		String.fromCharCode(...new Uint8Array(signature))
	);
}
