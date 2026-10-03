import type { CommandHandler, EventHandler, EventMiddleware } from '@snowluma/sdk'
import type JsBot from '../bot'
import isPluginEnabled from './gate'
import logger from '../logger/logger'

export default function pluginRegister(bot: JsBot) {
    const log = new logger(`[bot::plugin::register]`)
    for (let [name, meta] of bot.handers) {
        name = name.replace(/^(Command|Middleware|Notice)::/, "")
        log.info(`Register ${meta.type} ${name}`)
        switch (meta.type) {
            case 'Command': {
                const handler = meta.handler as CommandHandler
                bot.client.command(name, async (event, ctx, match) => {
                    if (!isPluginEnabled(bot, meta.plugin, event)) return
                    return handler(event, ctx, match)
                })
                break
            }
            case 'Request': {
                const handler = meta.handler as EventHandler
                bot.client.onRequest(async (event, ctx) => {
                    if (!isPluginEnabled(bot, meta.plugin, event)) return
                    return handler(event, ctx)
                })
                break
            }
            case 'Middleware': {
                const handler = meta.handler as EventMiddleware
                bot.client.use(async (event, ctx, next) => {
                    if (!isPluginEnabled(bot, meta.plugin, event)) return next()
                    return handler(event, ctx, next)
                })
                break
            }
            case 'Notice': {
                if (meta.notice) {
                    const handler = meta.handler as EventHandler
                    bot.client.onNotice(meta.notice, async (event, ctx) => {
                        if (!isPluginEnabled(bot, meta.plugin, event)) return
                        return handler(event, ctx)
                    })
                }
                break
            }
        }
    }
}
