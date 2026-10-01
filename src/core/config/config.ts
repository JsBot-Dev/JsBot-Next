import { readFileSync } from "node:fs";
import { z } from "zod";
import { PluginSetting } from "../plugin/manager";
import { Config, JsBotConfigSchema } from "./schema";




class JsBotConfig {
    WebSocketBaseUrl: string = ""
    WebSocketToken: string = ""
    Role: Config["role"] = { Superadmin: [], Admin: [] }
    PluginConfig: Map<string, PluginSetting> = new Map()

    constructor() {
        this.readConfig()
    }

    public readConfig(): void {
        let raw: unknown
        try {
            raw = JSON.parse(readFileSync("./bot.config.json", "utf-8"))
        } catch (error) {
            throw new Error(`Read Config Failed: ${error}`)
        }

        const result = JsBotConfigSchema.safeParse(raw)
        if (!result.success) {
            throw new Error(
                `Invalid Config:\n${JSON.stringify(z.treeifyError(result.error))}`
            )
        }

        const config = result.data

        this.WebSocketBaseUrl = config.url
        this.WebSocketToken = config.token
        this.Role = config.role
        this.PluginConfig = new Map<string, PluginSetting>(
            Object.entries(config.plugin)
        )
    }
}

export default JsBotConfig