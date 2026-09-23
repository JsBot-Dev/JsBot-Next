import JsBot from "../bot";

export default function pluginRegister(bot: JsBot) {
    for (const { name, fn } of bot.commands){
        bot.client.command(name,fn)
    }
}