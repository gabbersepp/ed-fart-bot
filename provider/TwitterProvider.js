import Twitter from "twitter-lite";
class TwitterProvider {
    async getLatestEarningsPost(twitterAuthOptions) {
        const client = new Twitter({
            subdomain: "api",
            consumer_key: twitterAuthOptions.consumerKey,
            consumer_secret: twitterAuthOptions.consumerSecret,
            access_token_key: twitterAuthOptions.accessToken,
            access_token_secret: twitterAuthOptions.accessTokenSecret
          });

        const timeline = await client.get("statuses/user_timeline", {
            screen_name: "eWhispers",
            exclude_replies: true,
            include_rts: false
            });

        const tweet = timeline.find(x => x.text.indexOf("#earnings for the week") > -1);

        if (!tweet) {
            return { error: true, msg: "tweet_not_found" };
        }

        const extendedTweet = await client.get(`statuses/show/${tweet.id_str}`, {
            tweet_mode: "extended"
        });

        if (!extendedTweet || !extendedTweet || !extendedTweet.entities || !extendedTweet.entities.media) {
            return { error: true, msg: "tweet_not_found" };
        }

        return { imgUrl: extendedTweet.entities.media[0].media_url };
    }
}

export let twitterProvider = new TwitterProvider();