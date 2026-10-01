import JsBot from "../bot";

export default function pluginRegister(bot: JsBot) {
    for (let [name, meta] of bot.handers) {
        name = name.replace(/^(Command|Middleware|Notice)::/, "")
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