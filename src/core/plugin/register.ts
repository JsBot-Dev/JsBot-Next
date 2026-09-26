import JsBot from "../bot";

export default function pluginRegister(bot: JsBot) {
    for(const [name,meta] of bot.handers){
        switch(meta.type){
            case 'Command': 
                bot.client.command(name,meta.handler)
                break
            case 'Request': 
                bot.client.onRequest(meta.handler)
                break
        }
    }
}