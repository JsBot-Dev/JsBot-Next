import JsBot from "../bot";

export class JsBotBasePlugin{
    readonly bot:JsBot
    name:string = this.constructor.name
    constructor(bot:JsBot){
        this.bot = bot
    }
    async get_kv(key:string){
        return this.bot.db.get(this.name,key)
    }
    async put_kv(key:string,value:any){
        return this.bot.db.set(this.name,key,value)
    }
}