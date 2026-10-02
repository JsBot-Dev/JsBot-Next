import { EventNext, OneBotMessageEvent } from "@snowluma/sdk";
import { CommandContext } from "../../../types/types";
import { Handlers, Middleware } from "../../../decorator/decorator";
import { JsBotBasePlugin } from "../../../plugin/base";

export default class InjectionPlugin extends JsBotBasePlugin {
    @Middleware()
    EventInjection(event: OneBotMessageEvent, ctx: CommandContext, next: EventNext) {
        const message = event.raw_message
        if (!message) return next()
        const messages = message.trimStart().split(/\s+/)
        if (!messages[0]) return next()
        if (!messages[0].startsWith('/')) return next()
        const prefix = messages[0].slice(1).toLowerCase()
        if (!prefix) return next()
        const meta = Handlers.get(`Command::${prefix}`)
        if (!meta) return next()
        event.admin_level = meta.permission
        event.plugin = meta.plugin
        this.logger.info(`User ${event.sender.nickname}(${event.user_id}) use ${event.admin_level} command /${prefix}`)
        return next()
    }
}