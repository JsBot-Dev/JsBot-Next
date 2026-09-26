import "@snowluma/sdk";
import { PermissionType } from "../decorator/decorator";
declare module '@snowluma/sdk' {
    interface OneBotPrivateMessageEvent {
        admin_level?: PermissionType | undefined;
    }
    interface OneBotGroupMessageEvent {
        admin_level?: PermissionType | undefined;
    }
}