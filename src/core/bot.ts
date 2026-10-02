import { CommandHandler, EventMiddleware, OneBotMessageEvent, SnowLumaWebSocketClient } from '@snowluma/sdk';
import JsBotConfig from './config/config'
import pluginLoad from './plugin/load';
import pluginRegister from './plugin/register';
import { HandlerMeta } from './decorator/decorator';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KvData } from './kv/kv';
import logger from './logger/logger';
class JsBot {
    readonly client: SnowLumaWebSocketClient;
    config: JsBotConfig
    started: boolean = false
    handers: Map<string, HandlerMeta> = new Map()
    plugins: any[] = []
    db!: KvData
    constructor() {
        this.config = new JsBotConfig
        this.client = new SnowLumaWebSocketClient({
            url: this.config.WebSocketBaseUrl,
            accessToken: this.config.WebSocketToken
        })
    }
    public async start() {
        const log = new logger(`[bot]`)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        if (this.started) return
        try {
            log.info(`\x1b[1;35mStart Loading Built-in Plugins\x1b[0m`)
            await pluginLoad(this, path.join(__dirname, './built-in'))
            log.info(`\x1b[1;35mStart Loading User Plugins\x1b[0m`)
            await pluginLoad(this)
            this.db = new KvData(this.plugins)
            log.info(`\x1b[1;35mStart Register Handlers\x1b[0m`)
            pluginRegister(this)
            log.info(`\x1b[1;35mSuccessfully started up JsBot`)
        }catch(e){
            log.error(`Failed to start JsBot:\n${e}`)
            process.exit(1)
        }
        await this.client.connect()
        this.started = true
    }
}

export default JsBot;