import { EventNext, OneBotMessageEvent, text } from "@snowluma/sdk";
import { Middleware } from "../../core/decorator/decorator";
import { JsBotBasePlugin } from "../../core/plugin/base";
import { CommandContext } from "../../core/types/types";
import getRole from "../../utils/role";

export default class AuthPlugin extends JsBotBasePlugin {
    @Middleware()
    async auth(event: OneBotMessageEvent, ctx: CommandContext, next: EventNext) {
        if (event.post_type != 'message' && event.post_type != 'message_sent') return next()
        const level = event.admin_level
        const user = getRole(this.bot.config, event.user_id)
        switch (level) {
            case 'Superadmin':
                if (user === 'Superadmin')
                    return next()
                await this.refuse(ctx,event)
                return
            case 'Admin':
                if (user !== 'User')
                    return next()
                await this.refuse(ctx,event)
                return
            case 'User':
                return next()
        }
        return next()
    }
    async refuse(ctx: CommandContext, event: OneBotMessageEvent) {
        return await ctx.reply(text("权限不足").face(79))
    }
}