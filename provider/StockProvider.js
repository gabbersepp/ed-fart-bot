import { requester } from "./../logic/DataRequester";

class StockProvider {
    async getQuote(symbol) {
        try {
            const obj = await requester.getAndParseJson(`https://api.iextrading.com/1.0/stock/${symbol.toLowerCase()}/delayed-quote`);
            return { price: obj.delayedPrice };
        } catch (e) {
            return { error: true, underlyingError: e };
        }
    }
}

export let stockProvider = new StockProvider();