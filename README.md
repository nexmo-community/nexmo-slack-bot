# Nexmo Slack Bot

A Slack bot offering communications functionality using Nexmo

## Prerequisites

* Install and setup the [nexmo-cli](https://github.com/nexmo/nexmo-cli)
* Get a [Nexmo account](https://dashboard.nexmo.com/sign-up)
* Create a new [bot user](https://api.slack.com/bot-users) in Slack and take a note of the Slack bot token

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
BASE_URL=
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

Invite participants by directly providing their phone number

```sh
@nexmobot conference 14155550123 14155550456
```

## Deploying to Heroku

Create a new Heroku application and take a note of the URL for the new app.

```sh
heroku apps:create {name}
```

It's recommended to create a separate Nexmo application for your Heroku deployment. To create a new application use and take a note of the applicaiton ID (referred to as `NEXMO_APP_ID` below)

```
nexmo app:create "Live nexmobot" HEROKU_URL/answer HEROKU_URL/events --type=voice --keyfile=private.heroku.key
```

Buy a phone number for your live bot (referred to as `NEXMO_PHONE_NUMBER` below)

```sh
nexmo number:buy US --confirm
```

Link the number to the application you created

```sh
nexmo link:app PHONE_NUMBER NEXMO_APP_ID
```

Update the configuration for the Heroku application

```sh
heroku config:set \
SLACK_BOT_TOKEN=SLACK_BOT_TOKEN
SLACK_BOT_PHONE_NUMBERS={NEXMO_PHONE_NUMBER
NEXMO_APP_ID=NEXMO_APP_ID \
NEXMO_API_KEY=API_KEY \
NEXMO_API_SECRET=API_SECRET \
BASE_URL=HEROKU_URL \
NEXMO_PRIVATE_KEY="$(cat private.heroku.key)"
```

*Note: the `HEROKU_URL` should not contain a trailing slash*

Push your code to Heroku

```sh
git push heroku master
```
 

## Running the Tests

```sh
$ ava test/*
```