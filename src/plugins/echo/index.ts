import { chain, CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { Command, Permission} from "../../core/decorator/decorator";
import { CommandContext } from "../../core/types/types";
import { JsBotBasePlugin } from "../../core/plugin/base";

export default class EchoPlugin extends JsBotBasePlugin{
    // @Command()
    // async whocanfly(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
    //     await ctx.reply("You CANNOT fly")
    // }
    @Command()
    async info(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        console.log("test!")
        await ctx.reply(
            "Command."
        )
    }
}