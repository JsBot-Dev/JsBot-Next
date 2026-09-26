import { describe, it, expect, vi } from 'vitest'
import type JsBot from '../src/core/bot'
import pluginRegister from '../src/core/plugin/register' // 按你实际导出位置调整

type Meta = { type: string; handler: any }

function fake(entries: Array<[string, Meta]> = []) {
    return {
        handers: new Map<string, Meta>(entries),
        client: {
            command: vi.fn(),
            onRequest: vi.fn(),
            use: vi.fn(),
        },
    } as unknown as JsBot
}

describe('Register Plugin', () => {
    it('Command 类型调用 client.command', () => {
        const handler = vi.fn()
        const plugins: Array<[string, Meta]> = [
            ['echo', { type: 'Command', handler }],
            ['info', { type: 'Command', handler }],
            ['test', { type: 'Middleware', handler }]
        ]

        const bot = fake(plugins)

        pluginRegister(bot)
        for(const plugin of plugins){
            if(plugin[1].type==='Command')
                expect(bot.client.command).toHaveBeenCalledWith(plugin[0], plugin[1].handler)
            if(plugin[1].type==='Middleware')
                expect(bot.client.use).toHaveBeenCalledWith(plugin[1].handler)
        }
    })
})