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
    PluginSetting:PluginSetting[] = []
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
            this.PluginSetting = config?.plugin
        } catch (error) {
            console.error(`Read Config Failed: ${error}`)
            process.exit(0)
        }
    }
}
export default JsBotConfig