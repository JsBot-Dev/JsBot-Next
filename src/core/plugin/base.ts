import JsBot from "../bot";

export class JsBotBasePlugin{
    readonly bot:JsBot
    name:string = this.constructor.name
    constructor(bot:JsBot,name?:string){
        this.bot = bot
        if(name) this.name = name
    }
}