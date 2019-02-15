class CommandRegistry {
    constructor() {
        this.map = {};
    }

    register(commands, fn, hasParam = false) {
        commands.forEach(x => this.map[x] = { fn: fn, hasParam: hasParam });
    }

    execute(command, settings) {
        const cmd = this.map[command];
        if (cmd) {
            return cmd.fn(settings);
        }

        return null;
    }

    needsParameter(command) {
        const cmd = this.map[command];
        if (cmd) {
            return cmd.hasParam;
        }

        return false;
    }
}

export let commandRegistry = new CommandRegistry();