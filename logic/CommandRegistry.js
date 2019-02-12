class CommandRegistry {
    constructor() {
        this.map = {};
    }

    register(command, fn) {
        this.map[command] = fn;
    }

    execute(command, settings) {
        const cmd = this.map[command];
        if (cmd) {
            return cmd(settings);
        }

        return null;
    }
}

export let commandRegistry = new CommandRegistry();