import JsBot from "../bot";
import logger from "../logger/logger";

export default function pluginRegister(bot: JsBot) {
    const log = new logger(`[bot::plugin::register]`)
    for (let [name, meta] of bot.handers) {
        name = name.replace(/^(Command|Middleware|Notice)::/, "")
        log.info(`Register ${meta.type} ${name}`)
        switch (meta.type) {
            case 'Command':
                bot.client.command(name, meta.handler)
                break
            case 'Request':
                bot.client.onRequest(meta.handler)
                break
            case 'Middleware':
                bot.client.use(meta.handler)
                break
            case 'Notice':
                if(meta.notice)
                    bot.client.onNotice(meta.notice,meta.handler)
                break
        }
    }
}