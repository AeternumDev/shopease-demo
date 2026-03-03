import { ProductRepositoryStub } from '@/lib/services/product-repository.stub';

describe('ProductRepositoryStub', () => {
  let repo: ProductRepositoryStub;

  beforeEach(() => {
    repo = new ProductRepositoryStub();
  });

  describe('getAll', () => {
    it('gibt nur Produkte in stock zurück', async () => {
      const products = await repo.getAll();
      expect(products.length).toBeGreaterThan(0);
      products.forEach((p) => expect(p.in_stock).toBe(true));
    });
  });

  describe('getById', () => {
    it('gibt ein Produkt anhand der ID zurück', async () => {
      const all = await repo.getAll();
      const first = all[0];
      const found = await repo.getById(first.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(first.id);
    });

    it('gibt null für unbekannte ID zurück', async () => {
      const result = await repo.getById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('findet Produkte anhand des Namens (Groß-/Kleinschreibung ignoriert)', async () => {
      const all = await repo.getAll();
      const query = all[0].name.slice(0, 3).toLowerCase();
      const results = await repo.search(query);
      expect(results.length).toBeGreaterThan(0);
    });

    it('findet Produkte anhand der Kategorie', async () => {
      const all = await repo.getAll();
      const category = all[0].category;
      const results = await repo.search(category);
      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => expect(p.category.toLowerCase()).toContain(category.toLowerCase()));
    });

    it('gibt leeres Array zurück wenn kein Treffer', async () => {
      const results = await repo.search('zzzzzzzz-nicht-vorhanden');
      expect(results).toEqual([]);
    });
  });

  describe('create', () => {
    it('legt ein neues Produkt an und gibt es zurück', async () => {
      const data = {
        name: 'Testprodukt',
        description: 'Ein Testprodukt',
        price: 9.99,
        category: 'Test',
        image_url: null,
        in_stock: true,
      };
      const product = await repo.create(data);
      expect(product.id).toMatch(/^prod-/);
      expect(product.name).toBe('Testprodukt');
      expect(product.created_at).toBeTruthy();
    });

    it('neues Produkt ist danach abrufbar', async () => {
      const data = {
        name: 'Neues Produkt',
        description: null,
        price: 5.0,
        category: 'Neu',
        image_url: null,
        in_stock: true,
      };
      const created = await repo.create(data);
      const found = await repo.getById(created.id);
      expect(found?.name).toBe('Neues Produkt');
    });
  });

  describe('update', () => {
    it('aktualisiert ein bestehendes Produkt', async () => {
      const all = await repo.getAll();
      const id = all[0].id;
      const updated = await repo.update(id, { price: 999.99 });
      expect(updated?.price).toBe(999.99);
    });

    it('gibt null zurück bei unbekannter ID', async () => {
      const result = await repo.update('nonexistent', { price: 1 });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('löscht ein Produkt und gibt true zurück', async () => {
      const all = await repo.getAll();
      const id = all[0].id;
      const result = await repo.delete(id);
      expect(result).toBe(true);
      const found = await repo.getById(id);
      expect(found).toBeNull();
    });

    it('gibt false zurück bei unbekannter ID', async () => {
      const result = await repo.delete('nonexistent-id');
      expect(result).toBe(false);
    });
  });
});
