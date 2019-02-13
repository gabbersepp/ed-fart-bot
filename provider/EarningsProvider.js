import { requester } from "./../logic/DataRequester";

class EarningsProvider {
    async lastEarningsDate(symbol) {
        try {
            const earnings = await requester.getAndParseJson(`https://api.iextrading.com/1.0/stock/${symbol.toLowerCase()}/earnings`);
            const possibleUpcoming = earnings.earnings[0];

            return { date: possibleUpcoming.EPSReportDate, amc: possibleUpcoming.announceTime === "AMC" };
        } catch (e) {
            if (e.error && e.parseError) {
                return { error: true, underlyingError: e, msg: "unknown_symbol" };
            }

            return { error: true, underlyingError: e };
        }
    }
}

export let earningsProvider = new EarningsProvider();