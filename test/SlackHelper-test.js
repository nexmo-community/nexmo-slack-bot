import test from 'ava';

const SlackHelper = require('../lib/SlackHelper');

const botUserId = 'U53RD5OO5';

test('can have direct menation with one token', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse({text: '<@U53RD5OO5> conference'});
	t.is(parsed.tokens[0], 'conference');
  t.true(parsed.tokens.length === 1);
});

test('can parse with direct mention with two tokens', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse({text: '<@U53RD5OO5> conference <@U0MCZ999T>'});
	t.is(parsed.tokens[0], 'conference');
  t.is(parsed.tokens[1], '<@U0MCZ999T>');
});

test('can parse with direct mention with three tokens', t => {
  const helper = new SlackHelper(botUserId);

  const parsed = helper.parse({text: '<@U53RD5OO5> conference <@U0MCZ999T> <@U0MCZ888T>'});
	t.true(parsed.tokens.length === 3);
});