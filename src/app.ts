import JsBot from './core/bot'

const bot = new JsBot()

await bot.start()

console.log(bot.commands)