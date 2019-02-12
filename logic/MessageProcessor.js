import { commandRegistry } from "./CommandRegistry";

export default class MessageProcessor {
    process(message) {
        const entities = this.extractEntities(message);

        //omit all other entities
        if (entities.length > 0) {
            return commandRegistry.execute(entities[0].command, { cmdParam: entities[0].parameter });
        }

        return null;
    }

    extractEntities(message) {
        const entities = message.entities || [];
        const list = entities.filter(x => x.type === "bot_command").map(x => {
            const trimmed = message.text.replace(/\s{2,}/g, " ");
            // remove slash
            const command = message.text.substr(x.offset + 1, x.length - 1);
            const parameterIndex = trimmed.indexOf(" ", x.offset + x.length);
            let parameter = "";

            if (parameterIndex > -1) {
                let end = trimmed.indexOf(" ", parameterIndex + 1);
                end = end > -1 ? (end - parameterIndex - 1) : (trimmed.length - parameterIndex);
                parameter = trimmed.substr(parameterIndex + 1, end);
            }

            return { command: command, parameter: parameter };
        });
        return list;
    }
}