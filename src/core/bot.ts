import { CommandHandler, EventMiddleware, OneBotMessageEvent, SnowLumaWebSocketClient } from '@snowluma/sdk';
import JsBotConfig from './config/config'
import pluginLoad from './plugin/load';
import pluginRegister from './plugin/register';
import { HandlerMeta } from './decorator/decorator';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KvData } from './kv/kv';
class JsBot {
    readonly client: SnowLumaWebSocketClient;
    config: JsBotConfig
    started: boolean = false
    handers: Map<string, HandlerMeta> = new Map()
    plugins: any[] = []
    db!:KvData
    constructor() {
        this.config = new JsBotConfig
        this.client = new SnowLumaWebSocketClient({
            url: this.config.WebSocketBaseUrl,
            accessToken: this.config.WebSocketToken
        })
    }
    public async start() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        
        if (this.started) return

        await pluginLoad(this,path.join(__dirname,'./built-in'))
        await pluginLoad(this)
        this.db = new KvData(this.plugins)
        pluginRegister(this)
        
        await this.client.connect()
        this.started = true
    }
}

export default JsBot;