import { CommandMatch, OneBotMessageEvent, SnowLumaEventContext } from "@snowluma/sdk";

export type CommandContext<TEvent extends OneBotMessageEvent = OneBotMessageEvent> = SnowLumaEventContext<TEvent> & {
    command: CommandMatch;
}