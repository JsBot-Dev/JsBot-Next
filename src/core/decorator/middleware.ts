import { EventMiddleware } from "@snowluma/sdk";

const MIDDLEWARE_LIST = new Array<EventMiddleware>
function Middleware(name: string) {
    return function (value: any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function (this) {
            MIDDLEWARE_LIST.push(value.bind(this))
        })
        return value
    }
}

export { MIDDLEWARE_LIST as MIDDLEWARE, Middleware }