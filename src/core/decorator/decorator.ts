import { EventHandler } from "@snowluma/sdk";

export type PermissionType = 'User' | 'Admin' | 'Superadmin'
export type HandlerType = 'Command' | 'Request' | 'Middleware' | 'Notice'
export interface HandlerMeta {
    handler: EventHandler
    type: HandlerType
    permission?: PermissionType
    plugin: string
    notice?: string
}
const Handlers: Map<string, HandlerMeta> = new Map()

function Command(name: string, permission?: PermissionType) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            name = name.toLowerCase()
            const ThisHandler = Handlers.get(`Command::${name}`)
            if (ThisHandler && ThisHandler.type === 'Command')
                throw new Error(`Register Failed: '${name}' Has already been registered.`)
            Handlers.set(`Command::${name}`, {
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
            const name = (context.name as string).toLowerCase()
            if (Handlers.get(name))
                throw new Error(`Register Failed: '${name}' Has already been registered.`)
            Handlers.set(
                `Middleware::${name}`,
                {
                    handler: value.bind(this),
                    type: 'Middleware',
                    plugin: this.constructor.name
                }
            )
        })
    }
}
function Notice(notice: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            const name = (context.name as string).toLowerCase()
            if (Handlers.get(name))
                throw new Error(`Register Failed: '${name}' Has already been registered.`)
            Handlers.set(
                `Notice::${name}`,
                {
                    handler: value.bind(this),
                    type: 'Notice',
                    plugin: this.constructor.name,
                    notice
                }
            )
        })
    }
}
export { Command, Middleware, Notice, Handlers }