import { CommandHandler, OneBotMessageEvent, SnowLumaWebSocketClient } from '@snowluma/sdk';
import JsBotConfig from './config'
import pluginLoad from './plugin/load';
import pluginRegister from './plugin/register';
class JsBot {
    readonly client: SnowLumaWebSocketClient;
    config: JsBotConfig
    isStrat: boolean = false
    commands: Map<string,CommandHandler<OneBotMessageEvent>> = new Map()
    adminCommands: Map<string,CommandHandler<OneBotMessageEvent> > = new Map()
    superAdminCommands: Map<string,CommandHandler<OneBotMessageEvent>> = new Map()

    constructor() {
        this.config = new JsBotConfig
        this.client = new SnowLumaWebSocketClient({
            url: this.config.WebSocketBaseUrl,
            accessToken: this.config.WebSocketToken
        })
    }
    public async start() {
        if (this.isStrat) return
        this.isStrat = true
        await pluginLoad(this)
        pluginRegister(this)
        await this.client.connect()
    }


}

export default JsBot;