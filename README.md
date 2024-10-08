# nsfwjs-server

[nsfwjs](https://github.com/infinitered/nsfwjs) wrapper as express server written in typescript.

See example environment variables in `.env.template`, all are optional.

JPEG, JPG, and PNG are accepted. Server will automatically convert to PNG using [sharp](https://npmjs.com/package/sharp).

Reminder to set `NODE_ENV` environment variable to `production` when running in production.

# Responses

## Unauthorized

Code 401

```json
{
  "message": "unauthorized"
}
```

## Bad image

Code 400

```json
{
  "message": "missing image"
}
```

## Server error

Code 500

```json
{
  "message": "server error"
}
```

## Success

Code 200

Float 1-0 = 100% and 0% confidence respectively

```json
{
  "message": "success",
  "probabilities": {
    "Hentai": 0.00000000000000001,
    "Drawing": 0.00000000000000001,
    "Porn": 0.00000000000000001,
    "Sexy": 0.00000000000000001,
    "Neutral": 0.00000000000000001
  }
}
```
