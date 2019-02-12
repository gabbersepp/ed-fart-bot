import { requester } from "./../logic/DataRequester";

class EarningsController {
    async getUpcomingEarnings(symbol) {
        try {
            const earnings = await requester.getAndParseJson(`https://api.iextrading.com/1.0/stock/${symbol.toLowerCase()}/earnings`);
            const possibleUpcoming = earnings.earnings[0];
            const date = new Date(possibleUpcoming.EPSReportDate);
            date.setHours(0,0,0,0);
            const now = new Date();
            now.setHours(0,0,0,0);
            
            if (date < now) {
                return {
                    error: true,
                    msg: "no_upcoming_availaible"
                };
            }
            
            return { date: possibleUpcoming.EPSReportDate, amc: possibleUpcoming.announceTime === "AMC" };
        } catch (e) {
            if (e.error && e.parseError) {
                return { error: true, underlyingError: e, msg: "unknown_symbol" };
            }

            return { error: true, underlyingError: e };
        }
    }
}

export let earningsController = new EarningsController();