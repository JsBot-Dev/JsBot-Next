import { readFileSync } from 'fs'
import process from 'process';
import { PluginSetting } from '../plugin/manager';
import { JsBotConfigSchema } from './schema';
import { z } from 'zod';
export interface RoleConfig {
    Superadmin: number[]
    Admin: number[]
}
class JsBotConfig {
    WebSocketBaseUrl: string = "";
  WebSocketToken: string = "";
  Role: RoleConfig = { Superadmin: [], Admin: [] };
  PluginConfig: Map<string, PluginSetting> = new Map();

  constructor() {
    this.readConfig();
  }

  public readConfig() {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync("./bot.config.json", "utf-8"));
    } catch (error) {
      throw new Error(`Read Config Failed: ${error}`);
    }

    const result = JsBotConfigSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `Invalid Config:\n${JSON.stringify(z.treeifyError(result.error), null, 2)}`
      );
    }

    const config = result.data;

    this.WebSocketBaseUrl = config.url;
    this.WebSocketToken = config.token;
    this.Role = config.role; 
    this.PluginConfig = new Map(
      Object.entries(config.plugin) as [string, PluginSetting][]
    );
  }
}
export default JsBotConfig