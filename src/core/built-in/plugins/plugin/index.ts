import { EventNext, isGroupMessageEvent, OneBotMessageEvent } from "@snowluma/sdk";
import { CommandContext } from "../../../types/types";
import { JsBotBasePlugin } from "../../../plugin/base";
import { Middleware } from "../../../decorator/decorator";

export default class PluginSetting extends JsBotBasePlugin {
    @Middleware()
    async PluginSetting(event: OneBotMessageEvent, ctx: CommandContext, next: EventNext) {
        if (!event.plugin) return next()
        if (!isGroupMessageEvent(event)) return next()
        const config = this.bot.config.PluginConfig.get(event.plugin)
        if (!config) return next()
        if (config.status === 'enable') {
            if (!config.list || config.list.length === 0) return next()
            if (config.list.includes(event.group_id)) return next()
        }
        if (config.status === 'disable') {
            if (!config.list || config.list.length === 0) return
            if (!config.list.includes(event.group_id)) return next()
        }
        return
    }
}