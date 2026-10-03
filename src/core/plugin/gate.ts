import type { SnowLumaEvent } from '@snowluma/sdk'
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
        return isGroupMessage(event) ? config.list.includes(event.group_id) : true
    }

    if (!config.list?.length) return false
    return isGroupMessage(event) ? !config.list.includes(event.group_id) : false
}

function isGroupMessage(event: SnowLumaEvent): event is SnowLumaEvent & { group_id: number } {
    return event.post_type === 'message' && 'group_id' in event && typeof event.group_id === 'number'
}
