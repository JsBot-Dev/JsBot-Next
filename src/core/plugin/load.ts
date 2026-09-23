import fg from 'fast-glob'
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import JsBot from '../bot';
import { COMMAND_LIST } from '../command';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function pluginLoad(bot:JsBot) {
    const files = await fg("../plugins/*/index.ts", {
        cwd: path.join(__dirname, '..'),
        absolute: true,
        onlyFiles: true,
    })
    for (const file of files) {
        try {
            const PluginClass = (await import(pathToFileURL(file).href)).default
            new PluginClass()
        } catch(e){
            console.error(`导入插件失败:${e}`)
        }
    }
    bot.commands = COMMAND_LIST
}