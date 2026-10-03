import { describe, expect, it } from 'vitest'
import getRole from '../src/utils/role'

const config = (Admin: number[], Superadmin: number[]) => ({ Role: { Admin, Superadmin } }) as any

describe('getRole', () => {
    it('returns the highest matching role', () => {
        const target = config([2, 3], [1, 3])
        expect(getRole(target, 1)).toBe('Superadmin')
        expect(getRole(target, 2)).toBe('Admin')
        expect(getRole(target, 3)).toBe('Superadmin')
        expect(getRole(target, 99)).toBe('User')
    })

    it('supports boundary numeric user ids', () => {
        const target = config([0], [-1])
        expect(getRole(target, 0)).toBe('Admin')
        expect(getRole(target, -1)).toBe('Superadmin')
    })
})
