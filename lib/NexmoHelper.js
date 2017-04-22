const NexmoHelperError = require('./NexmoHelperError');
const SlackHelper = require('./SlackHelper');

class NexmoHelper {
  constructor(slackRtm, nexmo, config) {
    this.supportedCommands = ['conference'];

    this.slackRtm = slackRtm;
    this.nexmo = nexmo;
    this.config = config;

    this.slackHelper = new SlackHelper(this.slackRtm.activeUserId);
  }

  handleCommand(message) {
    if(!message.command) {
      throw new NexmoHelperError('no command');
    }

    if(this.supportedCommands.indexOf(message.command) === -1) {
      throw new NexmoHelperError(`"${message.command}" is an unsupported nexmobot command. Supported commands are "${this.supportedCommands.join(', ')}"`);
    }

    if(message.command === 'conference') {
      if(message.commandArgs.length <= 0) {
        throw new NexmoHelperError('"conference" command requires arguments for conference participants');
      }

      const usersToDialIn = {}; // key: user_id value:{phoneNumber: number, message: empty}
      const usersNotDialledIn = {}; // key: user_id value: {message: reason}

      message.commandArgs.forEach((userId) => {
        // Each user info will have to contain a `phone` in order to conference.
        // Part of the result message should say who is being dialled in and who couldn't be.

        // If team is mentioned e.g. @devrel - https://api.slack.com/methods/usergroups.list
        if(this.slackHelper.isUserGroup(userId)) {
          console.log('found userGroup', userId);
          // loop through group and get individual user info
          // For each individual user - https://api.slack.com/methods/users.info
        }
        else if(this.slackHelper.isIndividualUserId(userId)) {
          // For each individual user - https://api.slack.com/methods/users.info
          console.log('found individual user', userId);
        }
        else if(/\d+/.test(userId)) {
          console.log('found (assumed) phone number', userId);
          usersToDialIn[userId] = {phoneNumber: userId};
        }
        else {
          // unrecognisable userId. Add to usersNotDialledIn
          usersNotDialledIn[userId] = {message: 'could not determine user Id type. supported types are single user, user group or phone number'};
        }
      });

      let slackResponse = `The following users will be called: ${Object.keys(usersToDialIn).join(', ')}`;
      if(usersNotDialledIn.length) {
        slackResponse += `\nThere was a problem finding phone numbers for these users:  ${Object.keys(usersNotDialledIn).join(', ')}`;
      }
      this.slackRtm.sendMessage(slackResponse, message.channel);

      this._conferenceUsers(usersToDialIn, (callResults) => {
        console.log(callResults);
      });

    }

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

    Object.keys(users).forEach((userId) => {
    
      this._makeCall(userId, (result) => {
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
   * @param {any} phoneNumber 
   * @param {any} callback 
   * 
   * @memberOf NexmoHelper
   */
  _makeCall(phoneNumber, callback) {
    
    console.log('calling', phoneNumber);
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
      answer_url: ['https://nexmo-community.github.io/ncco-examples/conference.json']
    }, (error, result) => {
      if(error) {
        callResult.error = error;
        // console.error(error);
        if(error.statusCode === 429) {
          const backOffMillis = error.headers['retry-after'];
          console.log(`429 response returned. retrying after ${backOffMillis} seconds`);
          
          setTimeout(() => {
            this._makeCall(phoneNumber, callback);
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