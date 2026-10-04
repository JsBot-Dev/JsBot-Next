import { chain, CommandMatch, OneBotMessageEvent, text } from "@snowluma/sdk";
import { Command } from "../../core/decorator/decorator";
import { CommandContext } from "../../core/types/types";
import { JsBotBasePlugin } from "../../core/plugin/base";
import send_msg from "../../utils/sendmsg";

export default class EchoPlugin extends JsBotBasePlugin {
    @Command('utter', { permission: 'Admin', docs: '/utter <内容> AdminCommand: 原样输出内容' })
    async Utter(_event: OneBotMessageEvent, ctx: CommandContext, match: CommandMatch) {
        await send_msg(ctx, match.rest)
    }
    @Command('utter.raw', { permission: 'Admin', docs: '/utter.raw <内容> AdminCommand: 输出内容的CQ码' })
    async UtterRaw(_event: OneBotMessageEvent, ctx: CommandContext, match: CommandMatch) {
        await send_msg(ctx, text(match.rest))
    }
}