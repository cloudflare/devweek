# Challenge #1A: Hello Worker

## Setup

1. Install `npm` dependencies
2. Insert values for the following `wranger.toml` configuration keys:
    * `account_id`
    * `zone_id`

## Deploy

A local `"deploy"` script is included, found within the `package.json` file.

This is an alias for `wrangler publish`, but it will also run the `"build"` command before publishing.

```sh
$ npm run deploy
```

## Further Learning

Check out the [Introduction to Cloudflare Workers](https://egghead.io/courses/introduction-to-cloudflare-workers-5aa3) free video series!
