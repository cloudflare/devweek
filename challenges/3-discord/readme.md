# Challenge #3: Discord Bots

## Setup

1. Install `npm` dependencies
2. Create a [Discord Application](https://discord.com/developers/applications)
3. Store the Application's Client ID and Public Key values inside the `wrangler.toml` file's `[vars]` config:
  * `CLIENT_ID`
  * `PUBLICKEY`
4. Copy the Client Secret value, and then store it as Workers Secret using wrangler:
    ```sh
    $ wrangler secret put CLIENT_SECRET
    ```
5. Create a new KV Namespace, saving its ID value inside your `wrangler.toml` file


## Deploy

A local `"deploy"` script is included, found within the `package.json` file.

This is an alias for `wrangler publish`, but it will also run the `"build"` command before publishing.

```sh
$ npm run deploy
```
