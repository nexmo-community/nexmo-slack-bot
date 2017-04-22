# Nexmo Slack Bot

A Slack bot offering communications functionality using Nexmo

## Prerequisites

* Install and setup the [nexmo-cli](https://github.com/nexmo/nexmo-cli)
* Get a [Nexmo account](https://dashboard.nexmo.com/sign-up)

## Install

Clone the repo and install dependencies

```
git clone git@github.com:nexmo-community/nexmo-slack-bot.git
cd nexmo-slack-bot
npm install
```

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

Create a `.env` file with the following entries

```
SLACK_BOT_TOKEN=
SLACK_BOT_PHONE_NUMBERS=PHONE_NUMBER
NEXMO_API_KEY=
NEXMO_API_SECRET=
NEXMO_APP_ID=NEXMO_APP_ID
```

## Running the Nexmo Slack Bot

Running locally using Heroku toolbelt

```sh
$ env NEXMO_PRIVATE_KEY="`cat private.local.key`" heroku local
```

Running locally using foreman

```sh
$ env NEXMO_PRIVATE_KEY="`cat private.local.key`" foreman start
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

## Deploying to Heroku

TODO

## Running the Tests

```sh
$ ava test/*
```