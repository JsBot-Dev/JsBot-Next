import { CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { AdminCommand, Command, SuperAdminCommand } from "../../core/decorator/command";
import { CommandContext } from "../../core/types/types";

export default class EchoPlugin{
    @Command('utter')
    async utter(_eve:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        await ctx.reply(match.rest)
    }
}