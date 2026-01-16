import { Hono } from 'hono';
import { search } from '../services/searchService';

const searchRoutes = new Hono();

// GET /api/search?q=<query>&type=<type>&role=<role>
searchRoutes.get('/', async (c) => {
    const query = c.req.query('q') || '';
    const type = c.req.query('type');
    const role = c.req.query('role');

    const filters: { type?: string; role?: string } = {};

    if (type) filters.type = type;
    if (role) filters.role = role;

    const results = await search(query, filters);

    return c.json(results);
});

export default searchRoutes;
