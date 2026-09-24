import { CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { AdminCommand, Command, SuperAdminCommand } from "../../core/decorator/command";
import { CommandContext } from "../../core/types/types";

export default class EchoPlugin{
    @Command('utter')
    async utter(event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        console.log('utter has benn used')
        await ctx.reply(match.rest)
    }
}