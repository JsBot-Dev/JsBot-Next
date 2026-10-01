import fg from 'fast-glob'
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import JsBot from '../bot';
import { Handlers } from '../decorator/decorator';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function pluginLoad(bot:JsBot,loadPath?:string) {
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
            plugins.push(plugin.name)
        } catch(e){
            throw new Error(`Import Failed: ${e}`)
        }
    }
    bot.handers = Handlers
    bot.plugins.push(...plugins)
}