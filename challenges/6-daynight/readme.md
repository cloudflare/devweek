# Challenge #6: Day and Night

## Setup

1. Install `npm` dependencies
2. Optionally update the `LOCALE_DEFAULT` value within the `wrangler.toml` file.<br>_**Note:** This acts as a fallback value for when the incoming request is missing the `Accept-Language` header._


## Deploy

A local `"deploy"` script is included, found within the `package.json` file.

This is an alias for `wrangler publish`, but it will also run the `"build"` command before publishing.

```sh
$ npm run deploy
```
