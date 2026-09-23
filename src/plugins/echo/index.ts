import { CommandMatch, OneBotMessageEvent } from "@snowluma/sdk";
import { Command } from "../../core/command";
import { CommandContext } from "../../core/types/types";

export default class EchoPlugin{
    @Command('ECHO_COMMAND')
    command(_eve:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        ctx.reply(match.rest)
    }
}