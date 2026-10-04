import { isGroupMessageEvent, type SnowLumaEvent } from '@snowluma/sdk'
import type JsBot from '../bot'

/** Checks a plugin's scope for the current event. Handlers stay globally registered. */
export default function isPluginEnabled(
    bot: JsBot,
    plugin: string,
    event: SnowLumaEvent,
): boolean {
    const config = bot.config.PluginConfig.get(plugin)
    if (!config) return true

    if (config.status === 'enable') {
        if (!config.list?.length) return true
        return isGroupMessageEvent(event) ? config.list.includes(event.group_id) : true
    }

    if (!config.list?.length) return false
    return isGroupMessageEvent(event) ? !config.list.includes(event.group_id) : false
}
