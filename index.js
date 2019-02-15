import { earningsController } from "./controller/EarningsController";
import { stockController } from "./controller/StockController";
import MessageProcessor from "./logic/MessageProcessor";
import { commandRegistry } from "./logic/CommandRegistry";
import { sessionStore } from "./logic/SessionStore";

const Slimbot = require('slimbot');
console.log(process.env["TELEGRAM_BOT_TOKEN"]);

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);

commandRegistry.register(["quote", "q"], stockController.getQuote);
commandRegistry.register(["lastearnings", "le"], earningsController.lastEarnings);
commandRegistry.register(["nextearnings", "ne"], earningsController.lastEarningsTweet.bind(null, getTwitterAuthOptions()));

slimbot.on('message', async message => {
  let result = new MessageProcessor().processMessage(message);

  if (result.then) {
    result = await result;
  }

  slimbot.sendMessage(message.chat.id, result, { parse_mode: "Markdown" });
});

slimbot.on('inline_query', async query => {
  const userId = query.from.id;
  const lastSession = sessionStore.getLastSession(userId);

  if (lastSession && lastSession.setTimeoutId) {
    clearTimeout(lastSession.setTimeoutId);
  }

  if (query.query.indexOf(" ") == -1) {
    sendMessage(query.id, "Bitte Symbol eingeben");
  } else {
    const sid = setTimeout(async () => {

      console.log(`process query '${query.query}`);
      let result = new MessageProcessor().processInlineQuery(query) || {};
  
      if (result.then) {
        result = await result;
      }
  
      sendMessage(query.id, result || "Kein Ergebnis");
    }, 500);
  
    sessionStore.startSession(userId, { setTimeoutId: sid });
  }
});

slimbot.startPolling();

function sendMessage(queryId, result) {
  let results = JSON.stringify([{
    'type': 'article',
    'id': new Date().toString(),
    'title': result,
    'description': result,
    'input_message_content': {
      'message_text': result,
      'parse_mode': 'Markdown',
      'disable_web_page_preview': true
    }
  }]);

  slimbot.answerInlineQuery(queryId, results, { cache_time: 0 });
}

function getTwitterAuthOptions() {
  return {
    consumerKey: process.env["TWITTER_CONSUMER_KEY"],
    consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
    accessToken: process.env["TWITTER_ACCESS_TOKEN"],
    accessTokenSecret: process.env["TWITTER_ACCESS_TOKEN_SECRET"]
  }
}