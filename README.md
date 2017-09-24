# node-botometer

This package evaluates Twitter accounts using **[Botometer](https://botometer.iuni.iu.edu/#!/)**, which "checks the activity of a Twitter account and gives it a score based on how likely the account is to be a bot. Higher scores are more bot-like."

It uses [Twit](https://github.com/ttezel/twit) and Botometer's [mashape API](https://market.mashape.com/OSoMe/botometer)

## Install

`npm install node-botometer`

## Use

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

Get Botometer scores for Twitter accounts in bulk:
```js
B.getBatchBotScores(["collinskeith","usinjuries","actual_ransom"],data => {
  console.log(data);
});
```

Get Botometer scores for one Twitter account:
```js
async function awaitScore(name) {
  const data = await B.getBotScore(name);
  console.log(data.botometer);
}

awaitScore("collinskeith");
```