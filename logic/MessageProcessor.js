import { commandRegistry } from "./CommandRegistry";
import { sessionStore } from "./SessionStore";

export default class MessageProcessor {
    processMessage(message) {
        const entities = this.extractEntities(message);

        //omit all other entities
        if (entities.length > 0) {
            //const entity = entities[0];

            //if (commandRegistry.needsParameter(entity.command) && !entity.parameter) {
            //    sessionStore.startSession(message.from.id, entities[0])
            //} else {
                return commandRegistry.execute(entities[0].command, { cmdParam: entities[0].parameter });
            //}
        //} else {
            // maybe a former command exists
           // sessionStore
        }

        return null;
    }

    processInlineQuery(query) {
        const trimmed = this.cleanMessage(query.query);
        let indexOfCommandParamDivider = trimmed.indexOf(" ");
        indexOfCommandParamDivider = indexOfCommandParamDivider < 0 ? trimmed.length : indexOfCommandParamDivider;
        const entity = this.extractEntity(trimmed, 0, indexOfCommandParamDivider);

        if (entity && entity.command) {
            return commandRegistry.execute(entity.command, { cmdParam: entity.parameter });
        }

        return null;
    }

    extractEntities(message) {
        const entities = message.entities || [];
        const list = entities.filter(x => x.type === "bot_command").map(x => {
            return this.extractEntity(message.text, x.offset, x.length)
        });
        return list;
    }

    extractEntity(text, offset, length) {
        const trimmed = this.cleanMessage(text);

        // remove slash if exists
        let command = "";
        if (trimmed.indexOf("/") > -1) {
            command = trimmed.substr(offset + 1, length - 1);
        } else {
            command = trimmed.substr(offset, length);
        }

        const parameterIndex = trimmed.indexOf(" ", offset + length);
        let parameter = "";

        if (parameterIndex > -1) {
            let end = trimmed.indexOf(" ", parameterIndex + 1);
            end = end > -1 ? (end - parameterIndex - 1) : (trimmed.length - parameterIndex);
            parameter = trimmed.substr(parameterIndex + 1, end);
        }

        return { command: command, parameter: parameter };
    }

    cleanMessage(text) {
        return text.replace(/@[^\s]+/, "").replace(/\s{2,}/g, " ").trim();
    }
}