import JsBot from "../bot";

export default function pluginRegister(bot: JsBot) {
    for(const middleware of bot.middlewares){
        bot.client.use(middleware)
    }
    for (const [name, fn] of bot.commands) {
        console.log(`register ${name} : ${fn}`)
        bot.client.command(name, fn)
    }
    for (const [name, fn] of bot.adminCommands) {
        bot.client.command(name, fn)
    }
    for (const [name, fn] of bot.superAdminCommands) {
        bot.client.command(name, fn)
    }
    
}