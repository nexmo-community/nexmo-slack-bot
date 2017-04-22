const deepCopy = require('deep-copy');

class SlackHelper {
  constructor(userId) {
    this.userId = userId;

    this.directMentionRegExStr = `^<@${this.userId}>`;
    this.directMentionRegEx = new RegExp(this.directMentionRegExStr);

    this.commandRegExStr = `(?:${this.directMentionRegExStr}\\s+)(\\w+)(.*)?`;
    this.commandRegEx = new RegExp(this.commandRegExStr);

    this.singleUserIdRegExStr = '<(\\S+)>';
    this.singleUserIdRegEx = new RegExp(this.singleUserIdRegExStr);

    this.userGroupIdRegExStr = '^<\!subteam\\^(\\S+)\\|(@\\w+)';
    this.userGroupIdRegEx = new RegExp(this.userGroupIdRegExStr);
  }

  parse(message) {
    const parsedMessage = deepCopy(message);

    // console.log('parsing------------');
    // console.log(parsedMessage);

    parsedMessage.isDirectMention = this.directMentionRegEx.test(message.text);

    if(parsedMessage.isDirectMention === true) {
      // Get first word following direct mention
      // console.log(this.commandRegExStr)
      const matchResult = this.commandRegEx.exec(message.text);
      // console.log(matchResult);
      if(matchResult) {
        parsedMessage.command = matchResult[1];
        parsedMessage.commandArgs = (matchResult[2]? matchResult[2].trim().split(' '): []);
      }
    }

    // console.log('parsed------------');
    // console.log(parsedMessage);

    return parsedMessage;
  }

  isUserGroup(userId) {
    return this.userGroupIdRegEx.test(userId);
  }

  isIndividualUserId(userId) {
    return this.singleUserIdRegEx.test(userId);
  }
}

module.exports = SlackHelper;