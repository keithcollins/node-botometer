"use strict";

const unirest = require('unirest');
const Promise = require('bluebird');
const Twit = require('twit');

const botometer = function(config) {

  // twitter api credentials
  const T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
    app_only_auth: config.app_only_auth
  });

  // botometer api credentials
  const mashape_key = config.mashape_key;

  // delay for twitter API calls
  const rate_limit = config.rate_limit || 0;

  // whether to console log names as they're collected
  const log_progress = config.log_progress || true;

  // all logging here
  const writeLog = function(message) {
    if (log_progress) console.log(message);
  }

  // search with multiple endpoints
  this.searchTwitter = function(ep,opts) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        T.get(ep,opts,function(e,data,r) {
          if (e || r.statusCode !== 200) reject(new Error(e));
          data = (ep == 'search/tweets') ? data.statuses : data;
          resolve(data);
        });
      },rate_limit);
    });
  }

  // get botometer score
  this.getBotometer = function(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        unirest.post("https://osome-botometer.p.mashape.com/2/check_account")
          .header("X-Mashape-Key", mashape_key)
          .header("Content-Type", "application/json")
          .header("Accept", "application/json")
          .send(data)
          .end(function (result) {
            // writeLog(result.status, result.headers, result.body);
            resolve(result.body);
          });
      },rate_limit);
    });
  }

  // returns a user object, their latest tweets and mentions, and bot score
  this.getBotScore = function(screen_name) {
    const data = {user:null,timeline:null,mentions:null};
    return new Promise((resolve, reject) => {
      this.searchTwitter('statuses/user_timeline',{screen_name:screen_name,count:200})
        .catch(e => {
          // if no timeline resolve with empty array
          resolve([]);
        })
        .then(timeline => {
          data.user = timeline[0].user;
          data.timeline = timeline;
          return this.searchTwitter('search/tweets',{q:"@"+screen_name,count:100})
        })
        .catch(e => {
          // if error finding mentions move on with empty array
          return [];
        })
        .then(mentions => {
          data.mentions = mentions;
          return this.getBotometer(data);
        })
        .catch(e => {
          // if error on botometer resolve with collected data
          data.botometer = {};
          resolve(data);
        })
        .then(botometer => {
          data.botometer = botometer;
          resolve(data);
        });
    });
  }

  // takes like six seconds per account to complete
  this.getBatchBotScores = async function(names,cb) {
    const scores = [];
    for (let name of names) {
      writeLog("Awaiting score for "+name);
      const data = await this.getBotScore(name);
      if (typeof data.botometer.scores !== "undefined") {
        scores.push(data.botometer);
        writeLog(name+" is a "+data.botometer.scores.universal);
      } else {
        writeLog("No score found for "+name);
      }
    }
    cb(scores);
  }

}

module.exports = botometer;