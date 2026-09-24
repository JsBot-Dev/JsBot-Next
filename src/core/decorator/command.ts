import { CommandHandler, OneBotMessageEvent } from "@snowluma/sdk";

const COMMAND_LIST: Array<{ name: string, fn: CommandHandler<OneBotMessageEvent> }> = [];
const ADMIN_COMMAND_LIST: Array<{ name: string, fn: CommandHandler<OneBotMessageEvent> }> = [];
const SUPERADMIN_COMMAND_LIST: Array<{ name: string, fn: CommandHandler<OneBotMessageEvent> }> = []

function Command(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            COMMAND_LIST.push({ name, fn: value.bind(this) })
        })
        return value
    }
}

function AdminCommand(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            ADMIN_COMMAND_LIST.push({ name, fn: value.bind(this) })
        })
        return value
    }
}
function SuperAdminCommand(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            SUPERADMIN_COMMAND_LIST.push({ name, fn: value.bind(this) })
        })
        return value
    }
}

export { Command, AdminCommand, SuperAdminCommand, COMMAND_LIST, ADMIN_COMMAND_LIST, SUPERADMIN_COMMAND_LIST }