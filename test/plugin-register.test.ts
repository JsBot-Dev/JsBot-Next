import { beforeEach, describe, expect, it, vi } from 'vitest'
import pluginRegister from '../src/core/plugin/register'

const enabled = vi.hoisted(() => vi.fn(() => true))
vi.mock('../src/core/plugin/gate', () => ({ default: enabled }))

function fake(entries: Array<[string, any]>) {
    return {
        handers: new Map(entries),
        config: { PluginConfig: new Map() },
        client: {
            command: vi.fn(),
            onRequest: vi.fn(),
            use: vi.fn(),
            onNotice: vi.fn(),
        },
    } as any
}

describe('pluginRegister', () => {
    beforeEach(() => enabled.mockReset().mockReturnValue(true))

    it('registers all supported handler types and strips prefixes', () => {
        const bot = fake([
            ['Command::echo', { type: 'Command', plugin: 'Echo', handler: vi.fn() }],
            ['Request::login', { type: 'Request', plugin: 'Auth', handler: vi.fn() }],
            ['Middleware::auth', { type: 'Middleware', plugin: 'Auth', handler: vi.fn() }],
            ['Notice::group_increase', { type: 'Notice', notice: 'group_increase', plugin: 'Notice', handler: vi.fn() }],
        ])

        pluginRegister(bot)

        expect(bot.client.command).toHaveBeenCalledWith('echo', expect.any(Function))
        expect(bot.client.onRequest).toHaveBeenCalledWith(expect.any(Function))
        expect(bot.client.use).toHaveBeenCalledWith(expect.any(Function))
        expect(bot.client.onNotice).toHaveBeenCalledWith('group_increase', expect.any(Function))
    })

    it('runs enabled command and request handlers with their arguments', async () => {
        const command = vi.fn().mockResolvedValue('command result')
        const request = vi.fn().mockResolvedValue('request result')
        const bot = fake([
            ['echo', { type: 'Command', plugin: 'Echo', handler: command }],
            ['login', { type: 'Request', plugin: 'Auth', handler: request }],
        ])
        pluginRegister(bot)
        const event = { id: 1 }
        const ctx = { reply: vi.fn() }
        const match = { rest: 'hello' }

        await expect(bot.client.command.mock.calls[0][1](event, ctx, match)).resolves.toBe('command result')
        await expect(bot.client.onRequest.mock.calls[0][0](event, ctx)).resolves.toBe('request result')
        expect(command).toHaveBeenCalledWith(event, ctx, match)
        expect(request).toHaveBeenCalledWith(event, ctx)
    })

    it('skips disabled commands and requests', async () => {
        enabled.mockReturnValue(false)
        const command = vi.fn()
        const request = vi.fn()
        const bot = fake([
            ['echo', { type: 'Command', plugin: 'Echo', handler: command }],
            ['login', { type: 'Request', plugin: 'Auth', handler: request }],
        ])
        pluginRegister(bot)
        expect(await bot.client.command.mock.calls[0][1]({}, {}, {})).toBeUndefined()
        expect(await bot.client.onRequest.mock.calls[0][0]({}, {})).toBeUndefined()
        expect(command).not.toHaveBeenCalled()
        expect(request).not.toHaveBeenCalled()
    })

    it('passes through enabled middleware and calls next for disabled middleware', async () => {
        const handler = vi.fn().mockResolvedValue('handled')
        const next = vi.fn().mockResolvedValue('next')
        const bot = fake([['auth', { type: 'Middleware', plugin: 'Auth', handler }]])
        pluginRegister(bot)
        await expect(bot.client.use.mock.calls[0][0]({}, {}, next)).resolves.toBe('handled')
        expect(handler).toHaveBeenCalledWith({}, {}, next)

        enabled.mockReturnValue(false)
        await expect(bot.client.use.mock.calls[0][0]({}, {}, next)).resolves.toBe('next')
        expect(next).toHaveBeenCalled()
    })

    it('registers notices only when notice metadata exists', async () => {
        const notice = vi.fn().mockResolvedValue('ok')
        const withoutNotice = vi.fn()
        const bot = fake([
            ['one', { type: 'Notice', notice: 'group_upload', plugin: 'N', handler: notice }],
            ['two', { type: 'Notice', plugin: 'N', handler: withoutNotice }],
        ])
        pluginRegister(bot)
        expect(bot.client.onNotice).toHaveBeenCalledTimes(1)
        await expect(bot.client.onNotice.mock.calls[0][1]({}, {})).resolves.toBe('ok')
        expect(notice).toHaveBeenCalled()
        expect(withoutNotice).not.toHaveBeenCalled()
    })
})
