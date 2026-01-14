import { describe, it, expect } from 'vitest'
import app from '../index'

describe('Health Check', () => {
    it('GET /health returns status ok', async () => {
        const res = await app.request('/health')
        expect(res.status).toBe(200)

        const json = await res.json()
        expect(json).toEqual({ status: 'ok' })
    })
})

describe('API Info', () => {
    it('GET /api returns API info', async () => {
        const res = await app.request('/api')
        expect(res.status).toBe(200)

        const json = await res.json()
        expect(json.message).toBe('TeamSpec Viewer API')
        expect(json.version).toBe('0.1.0')
    })
})
