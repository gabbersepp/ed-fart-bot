import { earningsProvider } from "./../provider/EarningsProvider";
import { twitterProvider} from "./../provider/TwitterProvider";

class EarningsController {
    async lastEarnings(settings) {
        const eResult = await earningsProvider.lastEarningsDate(settings.cmdParam);
        if (eResult.date) {
            const date = new Date(eResult.date);
            return `Letzen Earnings von *${settings.cmdParam}* = *${date.toLocaleDateString()} ${eResult.amc ? "AMC": "BMO"}* `;
        }

        return "";
    }

    async lastEarningsTweet(twitterAuthOptions) {
        const eResult = await twitterProvider.getLatestEarningsPost(twitterAuthOptions);

        if (eResult.error) {
            return "";
        }

        return `${eResult.imgUrl}`;
    }
}

export let earningsController = new EarningsController();