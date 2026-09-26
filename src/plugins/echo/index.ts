import { chain, CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { Command, Permission} from "../../core/decorator/decorator";
import { CommandContext } from "../../core/types/types";
import { JsBotBasePlugin } from "../../core/plugin/base";

export default class EchoPlugin extends JsBotBasePlugin{
    @Command()
    @Permission('Admin')
    async utter(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        await ctx.reply(match.rest)
    }
}