const NexmoHelperError = require('./NexmoHelperError');
const SlackHelper = require('./SlackHelper');

const uuidV1 = require('uuid/v1');

const HELP_MSG = `

I presently only support conferencing. You can create a conference call by telling me who to dial in to the conference. For example mention me and then list the phone numbers of those you'd like to conference in. So, \`@nexmobot conference 14155550123 14155550456\` would call both of those numbers and add them to a conference call.

I'll support more functionality in the future. Checkout my project on GitHub https://github.com/nexmo-community/nexmo-slack-bot and take a look at the issues to see what's planned. Please do get involved.`;

class NexmoHelper {
  constructor(slackRtm, nexmo, config) {
    this.supportedIntents = {
      'conference': this._conferenceIntent,
      'conf': this._conferenceIntent
    };

    this.slackRtm = slackRtm;
    this.nexmo = nexmo;
    this.config = config;

    this.slackHelper = new SlackHelper(this.slackRtm.activeUserId);
  }

  handleMessage(message) {
    if(!message.tokens) {
      throw new NexmoHelperError('Message only appears to contain a mention of the Nexmo Bot');
    }

    let intent = null;
    message.tokens.forEach( (token) => {
      if(this.supportedIntents[token]) {
        intent = this.supportedIntents[token];
      }
      return;
    } );

    console.log('aaa', intent);

    if(!intent) {
      this.slackRtm.sendMessage(`Sorry, I'm not sure what you're trying to do. ${HELP_MSG}`, message.channel);
    }
    else {
      console.log('HELLO');
      intent.call(this, message)
    }

  }

  _conferenceIntent(message) {

    if(message.tokens.length < 2) {
      throw new NexmoHelperError('"conference" intent requires tokens for conference participants. For example, phone numbers.');
    }

    const usersToDialIn = {}; // key: user_id value:{phoneNumber: number, message: empty}

    message.tokens.forEach((token) => {
      // Each user info will have to contain a `phone` in order to conference.
      // Part of the result message should say who is being dialled in and who couldn't be.

      // If team is mentioned e.g. @devrel - https://api.slack.com/methods/usergroups.list
      /*if(this.slackHelper.isUserGroup(token)) {
        console.log('found userGroup', token);
        // loop through group and get individual user info
        // For each individual user - https://api.slack.com/methods/users.info
      }
      else if(this.slackHelper.isIndividualUserId(token)) {
        // For each individual user - https://api.slack.com/methods/users.info
        console.log('found individual user', token);
      }
      else */
      if(/\d+/.test(token)) {
        console.log('found (assumed) phone number', token);
        usersToDialIn[token] = {phoneNumber: token};
      }
      else {
        // wasn't a userId, userGroup or a phone number
        console.log(`Ignoring token "${token}"`);
      }
    });

    let slackResponse = `The following users will be called: ${Object.keys(usersToDialIn).join(', ')}`;
    this.slackRtm.sendMessage(slackResponse, message.channel);

    this._conferenceUsers(usersToDialIn, (callResults) => {
      console.log(callResults);
    });
  }

  /**
   * Conference multiple users
   * 
   * @private
   * 
   * @param {any} users 
   * @param {any} callback 
   * 
   * @memberOf NexmoHelper
   */
  _conferenceUsers(users, callback) {
    const callResults = [];

    const conferenceId = `slack_conf_${uuidV1()}`;

    Object.keys(users).forEach((userId) => {
    
      this._makeCall(conferenceId, userId, (result) => {
        callResults.push(result);
      });

    });

    callback(callResults);

  }

  /**
   * Make a call to a single user
   * 
   * @private
   * 
   * @param {any} conferenceId
   * @param {any} phoneNumber 
   * @param {any} callback 
   * 
   * @memberOf NexmoHelper
   */
  _makeCall(conferenceId, phoneNumber, callback) {
    
    console.log('calling', phoneNumber);
    const answerUrl = `${this.config.BASE_URL}/answer?conference_id=${conferenceId}`;
    let callResult = {success: null, error: null};
    this.nexmo.calls.create({
      to: [{
        type: 'phone',
        number: phoneNumber
      }],
      from: {
        type: 'phone',
        number: this.config.SLACK_BOT_PHONE_NUMBERS[0] // use first configured number
      },
      answer_url: [answerUrl]
    }, (error, result) => {
      if(error) {
        callResult.error = error;
        // console.error(error);
        if(error.statusCode === 429) {
          const backOffMillis = error.headers['retry-after'];
          console.log(`429 response returned. retrying after ${backOffMillis} seconds`);
          
          setTimeout(() => {
            this._makeCall(conferenceId, phoneNumber, callback);
          }, backOffMillis);
        }
      }
      else {
        callResult.success = result;
        // console.log(result);
      }
      callback(callResult);
    });
  }

}

module.exports = NexmoHelper;
