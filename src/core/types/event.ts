import "@snowluma/sdk";
export type CommandLevel = 'User'|'Admin'|'SuperAdmin'
declare module '@snowluma/sdk' {
    interface OneBotPrivateMessageEvent {
        admin_level?: CommandLevel;
    }
    interface OneBotGroupMessageEvent {
        admin_level?: CommandLevel;
    }
}