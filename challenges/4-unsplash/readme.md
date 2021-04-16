# Challenge #4: Random Rendering

## Setup

1. Install `npm` dependencies
2. Create an [Unsplash Application](https://unsplash.com/oauth/applications/new)
3. Store the Application's Access Key as the `ACCESSKEY` binding within your `wrangler.toml` file


## Deploy

A local `"deploy"` script is included, found within the `package.json` file.

This is an alias for `wrangler publish`, but it will also run the `"build"` command before publishing.

```sh
$ npm run deploy
```
