import { EventNext, OneBotMessageEvent } from "@snowluma/sdk";
import { CommandContext } from "../types/types";
import { Handlers } from "../decorator/decorator";


export function eventInjection(event: OneBotMessageEvent, ctx: CommandContext, next: EventNext) {
    const message = event.raw_message
    if (!message) return next()
    const messages = message.split(" ")
    if (!messages[0]) return next()
    const prefix = messages[0].slice(1)
    if(!prefix) return next()
    const meta = Handlers.get(prefix)
    if(!meta) return next()
    event.admin_level = meta.permission
    return next()
}