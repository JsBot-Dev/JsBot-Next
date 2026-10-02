import { isGroupMessageEvent, node, OneBotMessageEvent, OutgoingMessage, toCQString } from "@snowluma/sdk";
import { CommandContext } from "../core/types/types";

const CHAR_THRESHOLD = 50;
const LINE_THRESHOLD = 3;  

export default async function send_msg(
    ctx: CommandContext,
    message: OutgoingMessage,
){
    const event = ctx.event as OneBotMessageEvent;
    const cq = toCQString(message);

    if (!isTooLong(cq)) {
        return await ctx.reply(message);
        
    }
    const info = await ctx.client.getLoginInfo();
    const nickname = info.nickname || 'Bot';
    const forward = node(event.self_id, nickname, message);
    if(isGroupMessageEvent(event)){
        return await ctx.client.sendGroupForwardMessage(event.group_id,forward);
    }else{
        return await ctx.client.sendPrivateForwardMessage(event.user_id,forward);
    }
}

function isTooLong(message:string){
    return message.length >= CHAR_THRESHOLD || message.split('\n').length >= LINE_THRESHOLD;
}