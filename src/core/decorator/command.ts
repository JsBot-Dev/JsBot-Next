import { CommandHandler, OneBotMessageEvent } from "@snowluma/sdk";

const COMMAND_LIST = new Map<string, CommandHandler<OneBotMessageEvent>>
const ADMIN_COMMAND_LIST = new Map<string, CommandHandler<OneBotMessageEvent>>
const SUPERADMIN_COMMAND_LIST = new Map<string, CommandHandler<OneBotMessageEvent>>

function Command(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            COMMAND_LIST.set(name, value.bind(this))
        })
        return value
    }
}

function AdminCommand(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            ADMIN_COMMAND_LIST.set(name, value.bind(this))
        })
        return value
    }
}
function SuperAdminCommand(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            SUPERADMIN_COMMAND_LIST.set(name, value.bind(this))
        })
        return value
    }
}

export { Command, AdminCommand, SuperAdminCommand, COMMAND_LIST, ADMIN_COMMAND_LIST, SUPERADMIN_COMMAND_LIST }