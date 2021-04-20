import * as views from './views';

const headers = {
	'content-type': 'text/html;charset=utf8'
};

export function render(html: string, status = 200) {
	return new Response(html, { status, headers });
}

export function error(status: number, reason: string) {
	let html = views.error(status, reason);
	return new Response(html, { status, headers });
}


// Convert a number into E164 format
// @see https://www.twilio.com/docs/glossary/what-e164
export const isE164 = (phone: string) => /^\+[1-9]\d{1,14}$/.test(phone);
export const toE164 = (phone: string) => '+' + phone.replace(/[^\d]/g, '');
