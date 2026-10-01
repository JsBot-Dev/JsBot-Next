import { readFileSync } from 'fs'
import process from 'process';
import { PluginSetting } from './plugin/manager';
export interface RoleConfig {
    Superadmin: number[]
    Admin: number[]
}
class JsBotConfig {
    WebSocketBaseUrl: string = ''
    WebSocketToken: string = ''
    Role: RoleConfig = { Superadmin: [], Admin: [] }
    PluginConfig: Map<string, PluginSetting> = new Map()
    constructor() {
        this.readConfig()
    }
    public readConfig() {
        try {
            const rawConfig = readFileSync('./bot.config.json', 'utf-8')
            const config = JSON.parse(rawConfig)

            this.WebSocketBaseUrl = config?.url
            this.WebSocketToken = config?.token
            this.Role = config?.role
            this.PluginConfig = new Map(
                Object.entries(config?.plugin ?? {})
            )
        } catch (error) {
            throw new Error(`Read Config Failed: ${error}`)
        }
    }
}
export default JsBotConfig