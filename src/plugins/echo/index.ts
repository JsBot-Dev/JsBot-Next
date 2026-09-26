import { chain, CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { Command} from "../../core/decorator/decorator";
import { CommandContext } from "../../core/types/types";

export default class EchoPlugin{
    // @Command()
    // async whocanfly(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
    //     await ctx.reply("You CANNOT fly")
    // }
    @Command()
    async info(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        await ctx.reply(
            chain().reply(event.message_id)
            .text("You Info").br()
            .text(`You QQ Number: ${event.user_id}`)
        )
    }
}