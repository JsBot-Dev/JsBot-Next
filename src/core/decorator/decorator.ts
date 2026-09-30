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
        context.addInitializer(function(this:any){
            Handlers.set(name,{
                handler: value.bind(this),
                type:'Command',
                permission:permission||'User',
                plugin: this.constructor.name
            })
        })
    }
}
function Middleware() {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this: any) {
            Handlers.set(
                context.name as string,
                {
                    handler: value.bind(this),
                    type: 'Middleware',
                    plugin: this.constructor.name
                }
            )
        })
        return value
    }
}
export { Command, Middleware, Handlers }