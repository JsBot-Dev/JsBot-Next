import JsBot from "../bot";

export default function pluginRegister(bot: JsBot) {
    for (const { name, fn } of bot.commands){
        bot.client.command(name,fn)
    }
    for (const { name, fn } of bot.adminCommands){
        bot.client.command(name,fn)
    }
    for (const { name, fn } of bot.superAdminCommands){
        bot.client.command(name,fn)
    }
}