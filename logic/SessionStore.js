class SessionStore {
    constructor() {
        this.map = {};
    }

    startSession(userId) {
        this.map[userId] = {};
    }

    getLastSession(userId) {
        return this.map[userId];
    }

    store(userId, property, value) {
        const obj = this.map[userId];
        if (obj) {
            obj[userId][property] = value;
        } else {
            throw new Error(`no open session for user ${userId} and property ${property}`);
        }
    }
}

export let sessionStore = new SessionStore();