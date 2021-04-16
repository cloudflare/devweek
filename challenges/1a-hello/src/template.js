import flag from 'country-code-emoji';

/**
 * @param {IncomingRequestCfProperties} cf
 * @returns {string}
 */
export function template(cf) {
	const { country } = cf;
	const emoji = flag(country) || '👋';

	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<title>WWCode Worker</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="https://unpkg.com/modern-css-reset/dist/reset.min.css" />
				<style>
					body {
						background: #003682;
						display: flex;
						align-items: center;
						justify-content: center;
						min-height: 100vh;
						font-family: sans-serif;
					}
					div.container {
						background: #fff;
						text-align: center;
						border-radius: 1rem;
						padding: 4rem;
						box-shadow: 5px 5px #414243;
					}
				</style>
		</head>
		<body>
			<div class="container">
				<h1>Hello Worker!</h1>
				<h2>You're connecting from ${country} ${emoji}</h2>
			</div>
		</body>
		</html>
	`;
}
