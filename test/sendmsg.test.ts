import { describe, expect, it, vi } from 'vitest'

const sdk = vi.hoisted(() => ({
    toCQString: vi.fn((message: unknown) => String(message)),
    isGroupMessageEvent: vi.fn(),
    node: vi.fn((id: number, nickname: string, message: unknown) => ({ id, nickname, message })),
}))
vi.mock('@snowluma/sdk', () => sdk)

import send_msg from '../src/utils/sendmsg'

function context(event: any) {
    return {
        event,
        reply: vi.fn().mockResolvedValue('reply'),
        client: {
            getLoginInfo: vi.fn().mockResolvedValue({ nickname: 'BotName' }),
            sendGroupForwardMessage: vi.fn().mockResolvedValue('group forward'),
            sendPrivateForwardMessage: vi.fn().mockResolvedValue('private forward'),
        },
    } as any
}

describe('send_msg', () => {
    it('replies directly when the message is below both thresholds', async () => {
        const ctx = context({ self_id: 10, user_id: 2 })
        sdk.toCQString.mockReturnValue('short')
        await expect(send_msg(ctx, 'hello' as any)).resolves.toBe('reply')
        expect(ctx.reply).toHaveBeenCalledWith('hello')
        expect(ctx.client.getLoginInfo).not.toHaveBeenCalled()
    })

    it('uses a group forward at the length boundary', async () => {
        const ctx = context({ self_id: 10, group_id: 123, user_id: 2 })
        sdk.toCQString.mockReturnValue('x'.repeat(50))
        sdk.isGroupMessageEvent.mockReturnValue(true)
        await expect(send_msg(ctx, 'long' as any)).resolves.toBe('group forward')
        expect(ctx.client.sendGroupForwardMessage).toHaveBeenCalledWith(123, expect.anything())
        expect(sdk.node).toHaveBeenCalledWith(10, 'BotName', 'long')
    })

    it('uses a private forward for three or more lines', async () => {
        const ctx = context({ self_id: 10, user_id: 2 })
        sdk.toCQString.mockReturnValue('a\nb\nc')
        sdk.isGroupMessageEvent.mockReturnValue(false)
        await expect(send_msg(ctx, 'a\nb\nc' as any)).resolves.toBe('private forward')
        expect(ctx.client.sendPrivateForwardMessage).toHaveBeenCalledWith(2, expect.anything())
    })

    it('falls back to Bot when login nickname is empty', async () => {
        const ctx = context({ self_id: 10, user_id: 2 })
        ctx.client.getLoginInfo.mockResolvedValue({ nickname: '' })
        sdk.toCQString.mockReturnValue('x'.repeat(50))
        sdk.isGroupMessageEvent.mockReturnValue(false)
        await send_msg(ctx, 'long' as any)
        expect(sdk.node).toHaveBeenCalledWith(10, 'Bot', 'long')
    })
})
