/**
 * Products & Projects API
 * Handles product and project data fetching
 */
import { API_BASE } from './common';

export interface Product {
    id: string;
    name: string;
    prefix: string;
    status: string;
    description: string;
    projectCount: number;
}

export interface ProductsResponse {
    products: Product[];
    count: number;
}

export interface Project {
    id: string;
    name: string;
    status: string;
    featureIncrementCount: number;
}

export interface ProjectsForProductResponse {
    productId: string;
    projects: Project[];
    count: number;
}

/**
 * Get all products
 */
export async function getProducts(): Promise<ProductsResponse> {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
}

/**
 * Get a product by ID
 */
export async function getProductById(productId: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
}

/**
 * Get all projects for a product
 */
export async function getProjectsForProduct(productId: string): Promise<ProjectsForProductResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
}
