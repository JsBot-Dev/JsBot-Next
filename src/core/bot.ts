import { CommandHandler, EventMiddleware, OneBotMessageEvent, SnowLumaWebSocketClient } from '@snowluma/sdk';
import JsBotConfig from './config'
import pluginLoad from './plugin/load';
import pluginRegister from './plugin/register';
import { eventInjection } from './middleware/admin';
import { HandlerMeta } from './decorator/decorator';
class JsBot {
    readonly client: SnowLumaWebSocketClient;
    config: JsBotConfig
    isStrat: boolean = false
    handers: Map<string, HandlerMeta> = new Map()
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

        this.client.use(eventInjection as EventMiddleware)
        await pluginLoad(this)
        pluginRegister(this)
        
        await this.client.connect()
    }
}

export default JsBot;