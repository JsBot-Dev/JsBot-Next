import fg from 'fast-glob'
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import JsBot from '../bot';
import { Handlers } from '../decorator/decorator';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function pluginLoad(bot:JsBot) {
    const files = await fg("../plugins/*/index.ts", {
        cwd: path.join(__dirname, '..'),
        absolute: true,
        onlyFiles: true,
    })
    const plugins = [];
    for (const file of files) {
        try {
            const PluginClass = (await import(pathToFileURL(file).href)).default
            plugins.push(PluginClass)
            new PluginClass(bot)
        } catch(e){
            console.error(`Import Failed: ${e}`)
        }
    }
    bot.handers = Handlers
    bot.plugins = plugins
}