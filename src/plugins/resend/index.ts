import { chain, CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { Command } from "../../core/decorator/decorator";
import { JsBotBasePlugin } from "../../core/plugin/base";
import { CommandContext } from "../../core/types/types";
import send_msg from "../../utils/sendmsg";
import ar from "zod/v4/locales/ar.cjs";

export default class ResendPlugin extends JsBotBasePlugin {
    @Command('resend.group', { permission: 'Admin', docs: '/resend.group <群号> <内容> AdminCommand: 将内容原样转发的指定群' })
    async resend(event: OneBotMessageEvent, ctx: CommandContext, match: CommandMatch) {
        const args = match.args
        if (args.length < 2) {
            await send_msg(ctx, chain()
                .reply(event.message_id)
                .text('/resend.group <群号> <内容> AdminCommand: 将内容原样转发的指定群')
            )
            return
        }
        const group = Number(args[0]), message = args.slice(1).join(' ')
        const res = await this.bot.client.rawResponse('send_group_msg', {
            group_id: group,
            message
        })
        await send_msg(ctx, chain().reply(event.message_id).text(`Result: ${res.status}`))
    }
}