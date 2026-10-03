import { describe, expect, it } from 'vitest'
import isPluginEnabled from '../src/core/plugin/gate'

function bot(pluginConfig: unknown) {
    return { config: { PluginConfig: new Map([['demo', pluginConfig]]) } } as any
}

const group = (group_id = 123) => ({ post_type: 'message', group_id }) as any
const privateMessage = { post_type: 'message', user_id: 1 } as any

describe('isPluginEnabled', () => {
    it('enables plugins without configuration', () => {
        expect(isPluginEnabled({ config: { PluginConfig: new Map() } } as any, 'demo', group())).toBe(true)
    })

    it('enables every event when enable has no list', () => {
        const target = bot({ status: 'enable' })
        expect(isPluginEnabled(target, 'demo', group())).toBe(true)
        expect(isPluginEnabled(target, 'demo', privateMessage)).toBe(true)
    })

    it('only enables listed groups for group messages', () => {
        const target = bot({ status: 'enable', list: [123] })
        expect(isPluginEnabled(target, 'demo', group(123))).toBe(true)
        expect(isPluginEnabled(target, 'demo', group(456))).toBe(false)
        expect(isPluginEnabled(target, 'demo', privateMessage)).toBe(true)
    })

    it('disables every event when disable has no list', () => {
        const target = bot({ status: 'disable' })
        expect(isPluginEnabled(target, 'demo', group())).toBe(false)
        expect(isPluginEnabled(target, 'demo', privateMessage)).toBe(false)
    })

    it('disables listed groups and non-group events for a disable list', () => {
        const target = bot({ status: 'disable', list: [123] })
        expect(isPluginEnabled(target, 'demo', group(123))).toBe(false)
        expect(isPluginEnabled(target, 'demo', group(456))).toBe(true)
        expect(isPluginEnabled(target, 'demo', privateMessage)).toBe(false)
    })

    it('does not treat non-message events or non-number group ids as group messages', () => {
        const target = bot({ status: 'enable', list: [123] })
        expect(isPluginEnabled(target, 'demo', { post_type: 'notice', group_id: 123 } as any)).toBe(true)
        expect(isPluginEnabled(target, 'demo', { post_type: 'message', group_id: '123' } as any)).toBe(true)
    })
})
