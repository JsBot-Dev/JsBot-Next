import { describe, expect, it } from 'vitest'
import isPluginEnabled from '../src/core/plugin/gate'

function bot(status: 'enable' | 'disable', list?: number[]) {
    return {
        config: {
            PluginConfig: new Map([['DemoPlugin', { status, ...(list ? { list } : {}) }]])
        }
    } as never
}

function group(group_id: number) {
    return { post_type: 'message', message_type: 'group', group_id } as never
}

function privateMessage() {
    return { post_type: 'message', message_type: 'private', user_id: 1 } as never
}

describe('plugin runtime gate', () => {
    it('keeps handlers globally enabled without a list', () => {
        expect(isPluginEnabled(bot('enable'), 'DemoPlugin', group(1))).toBe(true)
        expect(isPluginEnabled(bot('disable'), 'DemoPlugin', group(1))).toBe(false)
    })

    it('uses an enable list as a group whitelist', () => {
        expect(isPluginEnabled(bot('enable', [1]), 'DemoPlugin', group(1))).toBe(true)
        expect(isPluginEnabled(bot('enable', [1]), 'DemoPlugin', group(2))).toBe(false)
    })

    it('uses a disable list as a group blacklist', () => {
        expect(isPluginEnabled(bot('disable', [1]), 'DemoPlugin', group(1))).toBe(false)
        expect(isPluginEnabled(bot('disable', [1]), 'DemoPlugin', group(2))).toBe(true)
    })

    it('applies global status to events without a group', () => {
        expect(isPluginEnabled(bot('enable', [1]), 'DemoPlugin', privateMessage())).toBe(true)
        expect(isPluginEnabled(bot('disable', [1]), 'DemoPlugin', privateMessage())).toBe(false)
    })
})
