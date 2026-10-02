import fg from 'fast-glob'
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import JsBot from '../bot';
import { Handlers } from '../decorator/decorator';
import logger from '../logger/logger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function pluginLoad(bot:JsBot,loadPath?:string) {
    const log = new logger(`[bot::plugin::load]`)
    let cwd = loadPath?loadPath:path.join(__dirname, '../..')
    const files = await fg("./plugins/*/index.ts", {
        cwd,
        absolute: true,
        onlyFiles: true,
    })
    const plugins = [];
    for (const file of files) {
        try {
            const PluginClass = (await import(pathToFileURL(file).href)).default
            const plugin = new PluginClass(bot)
            log.info(`Successfully Loaded \x1b[1;34m${plugin.name}\x1b[0m`)
            plugins.push(plugin.name)
        } catch(e){
            throw new Error(`Import Failed:${e}`)
        }
    }
    bot.handers = Handlers
    bot.plugins.push(...plugins)
}