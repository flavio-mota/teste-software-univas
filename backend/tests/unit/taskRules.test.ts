import { describe, it, expect } from 'vitest'
import { canTransition } from '../../src/utils/taskRules'

describe('canTransition', () => {
    it('permite transição de PENDING para IN_PROGRESS', () => {
        expect(canTransition('PENDING', 'IN_PROGRESS')).toBe(true)
    })
    it('permite transição de IN_PROGRESS para COMPLETED', () => {
        expect(canTransition('IN_PROGRESS', 'COMPLETED',)).toBe(true)
    })
    it('permite transição de IN_PROGRESS para CANCELLED', () => {
        expect(canTransition('IN_PROGRESS', 'CANCELLED')).toBe(true)
    })
    it('permite transição de COMPLETED para CANCELLED', () => {
        expect(canTransition('COMPLETED', 'CANCELLED')).toBe(false)
    })
})