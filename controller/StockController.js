import { stockProvider } from "./../provider/StockProvider";

class StockController {
    async getQuote(settings) {
        const quoteResult = await stockProvider.getQuote(settings.cmdParam);
        if (quoteResult.price) {
            return `Preis *${settings.cmdParam}* = *${quoteResult.price}*`;
        }

        return "";
    }
}

export let stockController = new StockController();