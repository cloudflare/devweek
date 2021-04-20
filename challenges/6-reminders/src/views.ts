interface Template {
	title: string;
	message: string;
	styles?: string;
	body?: string;
}

function template(options: Template): string {
	return `
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<title>Twilio Reminders</title>
				<meta name="mobile-web-app-capable" content="yes">
				<meta name="apple-mobile-web-app-capable" content="yes">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<style>
					* {
						margin: 0;
						padding: 0;
					}
					html {
						font-size: 16px;
					}
					body {
						display: flex;
						align-items: center;
						justify-content: center;
						font-family: Roboto,Arial;
						font-size: 1.25rem;
						line-height: 1.5;
					}
					main {
						width: 90%;
						max-width: 480px;
						min-width: 50vw;
					}
					h1 {
						font-weight: 100;
					}
					small {
						padding: 0.25rem;
						background: rgb(211, 211, 211, 0.4);
						border-left: 0.25rem solid darkgray;
						padding-left: 1rem;
						font-size: 0.85rem;
					}
					input, button {
						padding: 0.5rem 1rem;
						margin: 0.5rem 0;
						font-size: 1rem;
					}
					@media screen and (min-width: 769px) {
						main { min-width: 0 }
					}
				</style>
				${options.styles ? options.styles.trim() : ''}
			</head>
			<body>
				<main>
					<h1>${options.title}</h1>
					<small>${options.message}</small>
					${options.body ? options.body.trim() : ''}
				</main>
			</body>
		</html>
	`.trim();
}

/**
 * The root/home page
 */
export const welcome = template({
	title: 'Twilio Reminders',
	message: '<b>NOTE:</b> Trial accounts may only send messages to their own verified number.',
	styles: `
		<style>
			form > *,
			label > * {
				display: block;
				width: 100%;
			}
			label span {
				margin-top: 2rem;
				font-size: 1.4rem;
				margin-bottom: 1rem;
			}
		</style>
	`,
	body: `
		<form method="POST" action="/login">
			<label for="phone">
				<span>Enter Your Phone Number</span>
				<input
					type="tel" id="phone" name="phone"
					pattern="^\+?[1-9]\d{1,14}$"
					placeholder="+1234567890"
					autocomplete="false"
					required
				/>
			</label>

			<button type="submit">
				Submit
			</button>
		</form>
	`,
});

/**
 * Create an Error page
 */
export function error(status: number, reason: string): string {
	return template({
		message: reason,
		title: `Error (${status})`,
		styles: `<style>h1,small{color:red;border-left-color:red}</style>`,
	});
}

/**
 * message sent screen
 */
export const sent = template({
	title: 'Success!',
	message: 'Please check your phone for a new SMS message.',
	styles: `<style>h1,small{color:green;border-left-color:green}</style>`,
});
