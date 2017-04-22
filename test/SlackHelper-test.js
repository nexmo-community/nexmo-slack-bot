import test from 'ava';

const SlackHelper = require('../lib/SlackHelper');

const botUserId = 'U53RD5OO5';

const singleUserConferenceMessage = { type: 'message',
                                      channel: 'G18U9XXXX',
                                      user: 'U0MCZ999T',
                                      text: '<@U53RD5OO5> conference <@U0MCZ999T>',
                                      ts: '1492867706.964258',
                                      source_team: 'T02XXXX8S',
                                      team: 'T02XXXX8S' };

const multiUserConferenceMessage = { type: 'message',
                                      channel: 'G18U9XXXX',
                                      user: 'U0MCZ999T',
                                      text: '<@U53RD5OO5> conference <@U0MCZ999T> <@U0MCZ888T>',
                                      ts: '1492867706.964258',
                                      source_team: 'T02XXXX8S',
                                      team: 'T02XXXX8S' };

const singleUserPhoneConferenceMessage = { type: 'message',
                                      channel: 'G18U9XXXX',
                                      user: 'U0MCZ999T',
                                      text: '<@U53RD5OO5> conference 14155550123',
                                      ts: '1492867706.964258',
                                      source_team: 'T02XXXX8S',
                                      team: 'T02XXXX8S' };

test('can have command with no arguments', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse({text: '<@U53RD5OO5> conference'});
	t.is(parsed.command, 'conference');
  t.true(parsed.commandArgs.length === 0);
});

test('can parse conference withs single user', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse(singleUserConferenceMessage);
	t.is(parsed.command, 'conference');
});

test('single user conference has one argument', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse(singleUserConferenceMessage);
	t.true(parsed.commandArgs.length === 1);
});

test('two user conference has two arguments', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse(multiUserConferenceMessage);
	t.true(parsed.commandArgs.length === 2);
});

test('single user phone number conference has one argument', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse(singleUserPhoneConferenceMessage);
	t.true(parsed.commandArgs.length === 1);
});