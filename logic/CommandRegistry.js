class CommandRegistry {
    constructor() {
        this.map = {};
    }

    register(commands, fn) {
        commands.forEach(x => this.map[x] = fn);
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