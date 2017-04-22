# Nexmo Slack Bot

A Slack bot offering communications functionality using Nexmo

## Install

TODO

Create a Nexmo application and take a note of the application ID that is output (referred to as `NEXMO_APP_ID` below)

```sh
nexmo app:create "nexmobot" https://example.com https://example.com --type=voice --keyfile=private.local.key
```

Buy a phone number and take a note of the number (referred to as `PHONE_NUMBER` below)

```sh
nexmo number:buy US --confirm
```

Link the number to the application you created

```sh
nexmo link:app PHONE_NUMBER NEXMO_APP_ID
```

## Usage

### `conference participants`

Invite one or more individual users

```sh
@nexmobot conference @leggetter @sammachin
```

Invite a user group

```sh
@nexmobot conference @devrel
```

Invite participants by directly providing their phone number

```sh
@nexmobot 14155550123 14155550456
```

## Developing

Running locally using Heroku toolbelt

```sh
$ env NEXMO_PRIVATE_KEY="`cat private.local.key`" heroku local
```

Running locally using foreman

```sh
$ env NEXMO_PRIVATE_KEY="`cat private.local.key`" foreman start
```

## Tests

```sh
$ ava test/*
```