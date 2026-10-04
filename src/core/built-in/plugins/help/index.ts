import { chain, CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { Command } from "../../../decorator/decorator";
import { JsBotBasePlugin } from "../../../plugin/base";
import { CommandContext } from "../../../types/types";
import send_msg from "../../../../utils/sendmsg";

export default class HelpPlugin extends JsBotBasePlugin {
    @Command('help')
    async help(event: OneBotMessageEvent, ctx: CommandContext, match: CommandMatch) {
        const args = match.args
        if (args.length === 0) {
            let message = chain().reply(event.message_id)
            const handlers = this.bot.handers
            for (let [name, meta] of handlers) {
                if (meta.type === 'Command') {
                    name = name.replace(/^(Command|Middleware|Notice)::/, "")
                    if (meta.commandOptions?.docs === '该指令没有描述') message = message.text(`/${name} `)
                    message = message.text(`${meta.commandOptions?.docs}`).br()
                }
            }
            return await send_msg(ctx, message)
        }
        if (!args[0]) return
        const command = args[0]
        if (!command.startsWith('/')) {
            await send_msg(ctx, chain().reply(event.message_id).text(`${command} 不是一个有效的指令`))
            return
        }
        const meta = this.bot.handers.get(('Command::' + command.slice(1)))
        if (!meta) {
            await send_msg(ctx, chain().reply(event.message_id).text(`${command} 不是一个有效的指令`))
            return
        }
        await send_msg(ctx, chain().reply(event.message_id).text(`${command} ${meta.commandOptions?.docs}`))
    }
}