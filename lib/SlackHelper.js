const deepCopy = require('deep-copy');

class SlackHelper {
  constructor(userId) {
    this.userId = userId;

    this.directMentionRegExStr = `^<@${this.userId}>`;
    this.directMentionRegEx = new RegExp(this.directMentionRegExStr);

    this.tokenRegExStr = `(${this.directMentionRegExStr})(?:\\s+)(.*)?`;
    this.tokenRegEx = new RegExp(this.tokenRegExStr);

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
      // console.log(this.tokenRegExStr)
      const matchResult = this.tokenRegEx.exec(message.text);
      // console.log(matchResult);
      if(matchResult) {
        parsedMessage.directMentionUser = matchResult[1];
        parsedMessage.tokens = matchResult[2].trim().split(' ');
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