import * as https from "https";

class DataRequester {

    getAndParseJson(url) {
        const promise = new Promise((resolve, reject) => {
            let data = '';

            const request = https.get(url);
            request.on('response', function( res ) {
                res.on('data', chunk => {
                    data += chunk;
                }).on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject({ msg: data, error: true, parseError: true });
                    }
                });
            }).on('error', e => {
                reject({ error: true, underlyingError: e });
            });

            request.end();
        })

        return promise;
    }
}

export let requester = new DataRequester();