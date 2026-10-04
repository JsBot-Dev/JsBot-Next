import { chain, OneBotMessageEvent } from "@snowluma/sdk";
import { Command } from "../../core/decorator/decorator";
import { JsBotBasePlugin } from "../../core/plugin/base";
import { CommandContext } from "../../core/types/types";
import send_msg from "../../utils/sendmsg";

export default class LikeMePlugin extends JsBotBasePlugin {
    @Command('赞我')
    async sendLike(event: OneBotMessageEvent, ctx: CommandContext) {
        const user = event.user_id
        try {
            const friends = (await this.bot.client.rawResponse('get_friend_list', {})).data
            let likeNumber: number = 50

            if (friends.some(item => item.user_id === user))
                likeNumber = 10

            const res = await this.bot.client.rawResponse('send_like', { user_id: user, times: likeNumber })

            if (res.status === 'ok')
                await send_msg(ctx, chain().reply(event.message_id).text(`给你点了 ${likeNumber} 个赞`))

            if (res.status === 'failed')
                if (res.wording === 'OIDB error 20003 on 0x7e5_104: 今日同一好友点赞数已达上限')
                    await send_msg(ctx, chain().reply(event.message_id).text("今日点赞量到上限了，明天再来吧"))
                else await send_msg(ctx, `Error: ${res.wording}`)

        } catch (e) {
            await send_msg(ctx, `Error: ${e}`)
        }
    }
}