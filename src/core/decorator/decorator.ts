import { EventHandler } from "@snowluma/sdk";

export type PermissionType = 'User' | 'Admin' | 'Superadmin'
export type HandlerType = 'Command' | 'Request' | 'Middleware'
export interface HandlerMeta {
    handler: EventHandler
    type: HandlerType
    permission?: PermissionType
    plugin: string
}
const Handlers: Map<string, HandlerMeta> = new Map()

function Command(name: string, permission?: PermissionType) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            if (Handlers.get(name.toLowerCase()))
                throw new Error(`Register Failed: '${name.toLowerCase()}' Has already been registered.`)
            Handlers.set(name.toLowerCase(), {
                handler: value.bind(this),
                type: 'Command',
                permission: permission || 'User',
                plugin: this.constructor.name
            })
        })
    }
}
function Middleware() {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            if (Handlers.get((context.name as string).toLowerCase()))
                throw new Error(`Register Failed: '${(context.name as string).toLowerCase()}' Has already been registered.`)
            Handlers.set(
                (context.name as string).toLowerCase(),
                {
                    handler: value.bind(this),
                    type: 'Middleware',
                    plugin: this.constructor.name
                }
            )
        })
    }
}
export { Command, Middleware, Handlers }