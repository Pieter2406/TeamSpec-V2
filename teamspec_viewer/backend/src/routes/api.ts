import { Hono } from 'hono'

export const apiRoutes = new Hono()

// Placeholder API routes - will be implemented in subsequent stories
apiRoutes.get('/', (c) => {
    return c.json({
        message: 'TeamSpec Viewer API',
        version: '0.1.0',
        endpoints: [
            'GET /health - Health check',
            'GET /api - API info',
        ]
    })
})
