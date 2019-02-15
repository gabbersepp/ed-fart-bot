import { earningsController } from "./controller/EarningsController";
import { stockController } from "./controller/StockController";
import MessageProcessor from "./logic/MessageProcessor";
import { commandRegistry } from "./logic/CommandRegistry";

const Slimbot = require('slimbot');
console.log(process.env["TELEGRAM_BOT_TOKEN"]);

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);

commandRegistry.register(["quote", "q"], stockController.getQuote);
commandRegistry.register(["lastearnings", "le"], earningsController.lastEarnings);
commandRegistry.register(["nextearnings", "ne"], earningsController.lastEarningsTweet.bind(null, getTwitterAuthOptions()));

slimbot.on('message', async message => {
  let result = new MessageProcessor().process(message);

  if (result.then) {
    result = await result;
  }

  slimbot.sendMessage(message.chat.id, result, { parse_mode: "Markdown" });
});

/*slimbot.on('inline_query', query => {

});*/

slimbot.startPolling();

function getTwitterAuthOptions() {
  return {
    consumerKey: process.env["TWITTER_CONSUMER_KEY"],
    consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
    accessToken: process.env["TWITTER_ACCESS_TOKEN"],
    accessTokenSecret: process.env["TWITTER_ACCESS_TOKEN_SECRET"]
  }
}