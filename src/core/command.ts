import { CommandHandler, OneBotMessageEvent } from "@snowluma/sdk";

const COMMAND_LIST: Array<{ name: string, fn: CommandHandler<OneBotMessageEvent> }> = [];

function Command(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            COMMAND_LIST.push({ name, fn: value.bind(this) }); 
        })
        return value;
    }
}

export { Command, COMMAND_LIST }