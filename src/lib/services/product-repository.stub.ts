import { IProductRepository } from './product-repository';
import { Product } from '@/types';
import { SEED_PRODUCTS } from '@/lib/data/products';

/**
 * Stub-Implementierung des Product-Repository.
 * Arbeitet mit lokalen In-Memory-Daten statt Supabase.
 * In Produktion würde dies durch Supabase-Queries mit RLS ersetzt.
 */
export class ProductRepositoryStub implements IProductRepository {
  private products: Product[] = [...SEED_PRODUCTS];

  async getAll(): Promise<Product[]> {
    return this.products.filter((p) => p.in_stock);
  }

  async getById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async search(query: string): Promise<Product[]> {
    const lower = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        (p.description?.toLowerCase().includes(lower) ?? false)
    );
  }

  async create(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const product: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.products.push(product);
    return product;
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.products[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
}

export const productRepository = new ProductRepositoryStub();
