# node-botometer

This package evaluates Twitter accounts using **[Botometer](https://botometer.iuni.iu.edu/#!/)**, which "checks the activity of a Twitter account and gives it a score based on how likely the account is to be a bot. Higher scores are more bot-like."

It uses [Twit](https://github.com/ttezel/twit) and Botometer's [mashape API](https://market.mashape.com/OSoMe/botometer). Twitter application and Botometer mashape API keys are required.

## Install

`npm install node-botometer`

## Use

### Setup

Note application level tokens `access_token` and `access_token_secret` are not required or recommended. Use consumer keys and set `app_only_auth` to `true` for less restrictive rate limiting from Twitter.

```js
const botometer = require('node-botometer');

const B = new botometer({
  consumer_key: '',
  consumer_secret: '',
  access_token: null,
  access_token_secret: null,
  app_only_auth: true,
  mashape_key: '',
  rate_limit: 0
});
```

### Get Botometer scores for Twitter accounts in bulk:

This takes about six seconds per account and I'm looking for ideas to make it faster!

```js
B.getBatchBotScores(["collinskeith","usinjuries","actual_ransom"],data => {
  console.log(data);
});
```

### Get Botometer scores for one Twitter account:
```js
async function awaitScore(name) {
  const data = await B.getBotScore(name);
  console.log(data.botometer);
}

awaitScore("collinskeith");
```
