import { EventHandler } from "@snowluma/sdk";

export type PermissionType = 'User' | 'Admin' | 'Superadmin'
export type HandlerType = 'Command' | 'Request' | 'Middleware'
export interface HandlerMeta {
    handler: EventHandler
    type: HandlerType
    permission?: PermissionType
}
const Handlers: Map<string, HandlerMeta> = new Map()

function Command() {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            Handlers.set(
                context.name as string,
                {
                    handler: value,
                    type: 'Command',
                    permission: 'User'
                }
            )
        })
        return value
    }
}
function Middleware() {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            Handlers.set(
                context.name as string,
                {
                    handler: value,
                    type: 'Middleware'
                }
            )
        })
        return value
    }
}
function Permission(permission: PermissionType) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            queueMicrotask(() => {
                const meta = Handlers.get(context.name as string)
                if (meta) meta.permission = permission
            })
        })
        return value
    }
}
export { Command, Permission, Middleware, Handlers }