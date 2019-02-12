import { earningsController } from "./controller/EarningsController";
import { stockController } from "./controller/StockController";
import MessageProcessor from "./logic/MessageProcessor";
import { commandRegistry } from "./logic/CommandRegistry";

const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);

commandRegistry.register("quote", stockController.getQuote);

slimbot.on('message', async message => {
  let result = new MessageProcessor().process(message);

  if (result.then) {
    result = await result;
  }

  slimbot.sendMessage(message.chat.id, result, { parse_mode: "Markdown" });
});

slimbot.startPolling();