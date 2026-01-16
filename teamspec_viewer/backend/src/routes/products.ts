import { Hono } from 'hono';
import {
    getAllProducts,
    getProductById,
    getProjectsForProduct,
} from '../services/productService';

const productsRoutes = new Hono();

// GET /api/products - List all products
productsRoutes.get('/', async (c) => {
    const products = await getAllProducts();
    return c.json(products);
});

// GET /api/products/:productId - Get single product
productsRoutes.get('/:productId', async (c) => {
    const { productId } = c.req.param();
    const product = await getProductById(productId);

    if (!product) {
        return c.json({ error: 'Product not found' }, 404);
    }

    return c.json(product);
});

// GET /api/products/:productId/projects - Get projects targeting this product
productsRoutes.get('/:productId/projects', async (c) => {
    const { productId } = c.req.param();
    const projects = await getProjectsForProduct(productId);
    return c.json(projects);
});

export default productsRoutes;
