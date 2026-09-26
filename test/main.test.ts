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
    const bot = fake([['echo', { type: 'Command', handler }]])

    pluginRegister(bot)                          // ← 调用被测函数

    expect(bot.client.command).toHaveBeenCalledTimes(1)      // ← 断言
    expect(bot.client.command).toHaveBeenCalledWith('echo', handler)
  })
})