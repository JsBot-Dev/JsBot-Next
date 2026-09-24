import { EventNext, OneBotMessageEvent } from "@snowluma/sdk";
import { CommandContext } from "../types/types";

export function eventInjection(event:OneBotMessageEvent,ctx:CommandContext,next:EventNext){
    event.admin_level = 'User'
    next()
}