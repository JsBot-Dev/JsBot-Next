import { chain, CommandMatch, OneBotMessageEvent, text } from "@snowluma/sdk";
import { Command} from "../../core/decorator/decorator";
import { CommandContext } from "../../core/types/types";
import { JsBotBasePlugin } from "../../core/plugin/base";
import send_msg from "../../utils/sendmsg";

export default class EchoPlugin extends JsBotBasePlugin{
    @Command('utter','Admin')
    async Utter(_event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        await send_msg(ctx,match.rest)
    }
    @Command('utter.raw','Admin')
    async UtterRaw(_event:OneBotMessageEvent,ctx:CommandContext,match:CommandMatch){
        await send_msg(ctx,text(match.rest))
    }
}