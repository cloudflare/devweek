/**
 * @source worktop/utils
 * @see https://github.com/lukeed/worktop/blob/master/src/utils.ts
 * @license MIT
 */

export const Encoder = /*#__PURE__*/ new TextEncoder;
export const encode = (input: string) => Encoder.encode(input);

export function viaHEX(input: string): Uint8Array {
	let i=0, len=input.length, out: number[] = [];

	if (len & 1) {
		input += '0';
		len++;
	}

	for (; i < len; i+=2) {
		out.push(parseInt(input[i] + input[i+1], 16));
	}

	return new Uint8Array(out);
}

/**
 * Tiny `Response` formatter/helper.
 * @param status The response status code
 * @param data The response body
 */
export function respond(status: number, data: any): Response {
	let headers = new Headers;
	if (data && typeof data === 'object') {
		headers.set('Content-Type', 'application/json');
		data = JSON.stringify(data);
	}
	return new Response(data, { status, headers });
}
