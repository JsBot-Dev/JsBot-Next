import { chain, CommandMatch, OneBotMessageEvent, text } from "@snowluma/sdk";
import { Command, Permission} from "../../core/decorator/decorator";
import { CommandContext } from "../../core/types/types";
import { JsBotBasePlugin } from "../../core/plugin/base";

export default class EchoPlugin extends JsBotBasePlugin{
    @Command()
    @Permission('Admin')
    async Utter(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        await ctx.reply(match.rest)
    }
    @Command()
    @Permission('Admin')
    async UtterRaw(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        await ctx.reply(text(match.rest))
    }
}