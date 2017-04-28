import test from 'ava';

const NexmoHelper = require('../lib/NexmoHelper');

test('cannot mention conference without any particpants', t => {
  const helper = new NexmoHelper({activeUserId: null}, null, null);

  const error = t.throws(() => {
    helper.handleMessage({text: '<@U53RD5OO5> conference'});
  });
  
  t.true(error.message === 'Message only appears to contain a mention of the Nexmo Bot');
});

// TODO: cannot pass null in as contructor arguments as those objects are interact with in success scenarios
test.skip('can have conference with single participant', t => {
  const helper = new NexmoHelper({activeUserId: null}, null, null);

  helper.handleMessage({tokens: '<@U53RD5OO5> conference <@U88DR5555>'.split(' ')});
});