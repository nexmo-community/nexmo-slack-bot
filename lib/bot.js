var pkgJson = require(__dirname + '/../package.json');
const config = require('./config');

console.log(`nexmobot bot v${pkgJson.version} is running`);
console.log('config loaded', config);

const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const SlackHelper = require('./SlackHelper');
const NexmoHelper = require('./NexmoHelper');
const NexmoHelperError = require('./NexmoHelperError');

const rtm = new RtmClient(config.SLACK_BOT_TOKEN);

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: config.NEXMO_API_KEY,
  apiSecret: config.NEXMO_API_SECRET,
  applicationId: config.NEXMO_APP_ID,
  privateKey: config.NEXMO_PRIVATE_KEY
}, {debug: true});

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  console.log(message);
  console.log('activeUserId', rtm.activeUserId);

  const slackHelper = new SlackHelper(rtm.activeUserId);
  const parsedMessage = slackHelper.parse(message);

  if(parsedMessage.isDirectMention) {
    const nexmoHelper = new NexmoHelper(rtm, nexmo, config);

    try {
      nexmoHelper.handleCommand(parsedMessage);
    }
    catch(error) {
      if(error instanceof NexmoHelperError) {
        rtm.sendMessage(`There was a problem handling the message \`${message.text}\`\nThe error was \`${error.message}\``, message.channel);
      }
      else {
        console.error(error);
        rtm.sendMessage('An unexpected error occurred. Please contact your nearest Nexmo Communications specialist.', message.channel);
      }
    }
  }

  // console.log('Message:', message); //this is no doubt the lamest possible message handler, but you get the idea
});





rtm.start();