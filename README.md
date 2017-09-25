# node-botometer

`node-botometer` evaluates Twitter accounts using [Botometer](https://botometer.iuni.iu.edu/#!/), which "checks the activity of a Twitter account and gives it a score based on how likely the account is to be a bot. Higher scores are more bot-like."

It uses [Twit](https://github.com/ttezel/twit) and Botometer's [mashape API](https://market.mashape.com/OSoMe/botometer). Twitter application and Botometer mashape API keys are required.

## Install

`npm install node-botometer`

## Use

### Setup

Use app-only keys `consumer_key` and `consumer_secret`, and set `app_only_auth` to `true` for less restrictive rate limiting from Twitter. User-level tokens `access_token` and `access_token_secret` are allowed but not required or recommended.

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

### Get Botometer scores

You can get scores for one account or for many. It takes about six seconds per account and I'm looking for ideas to make it faster!

```js
// array can be one screen name or many
const names = ["collinskeith","usinjuries","actual_ransom"];

B.getBatchBotScores(names,data => {
  console.log(data);
});
```
