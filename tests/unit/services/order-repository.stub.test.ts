import { OrderRepositoryStub } from '@/lib/services/order-repository.stub';
import { OrderStatus } from '@/types';

function makeOrderData(overrides?: Partial<{ user_id: string; status: OrderStatus }>) {
  return {
    user_id: overrides?.user_id ?? 'user-1',
    status: (overrides?.status ?? 'pending') as OrderStatus,
    total: 49.99,
    items: [],
  };
}

describe('OrderRepositoryStub', () => {
  let repo: OrderRepositoryStub;

  beforeEach(() => {
    repo = new OrderRepositoryStub();
  });

  describe('create', () => {
    it('legt eine neue Bestellung an und gibt sie zurück', async () => {
      const order = await repo.create(makeOrderData());
      expect(order.id).toMatch(/^order-/);
      expect(order.status).toBe('pending');
      expect(order.total).toBe(49.99);
      expect(order.created_at).toBeTruthy();
      expect(order.updated_at).toBeTruthy();
    });

    it('gibt jeder Bestellung eine ID mit korrektem Präfix', async () => {
      const a = await repo.create(makeOrderData());
      const b = await repo.create(makeOrderData());
      expect(a.id).toMatch(/^order-/);
      expect(b.id).toMatch(/^order-/);
    });
  });

  describe('getByUserId', () => {
    it('gibt nur Bestellungen des angegebenen Users zurück', async () => {
      await repo.create(makeOrderData({ user_id: 'user-A' }));
      await repo.create(makeOrderData({ user_id: 'user-B' }));
      const orders = await repo.getByUserId('user-A');
      expect(orders).toHaveLength(1);
      expect(orders[0].user_id).toBe('user-A');
    });

    it('gibt leeres Array zurück wenn der User keine Bestellungen hat', async () => {
      const orders = await repo.getByUserId('nobody');
      expect(orders).toEqual([]);
    });
  });

  describe('getAll', () => {
    it('gibt alle gespeicherten Bestellungen zurück', async () => {
      await repo.create(makeOrderData());
      await repo.create(makeOrderData());
      const all = await repo.getAll();
      expect(all).toHaveLength(2);
    });

    it('gibt eine Kopie zurück (keine direkte Referenz)', async () => {
      await repo.create(makeOrderData());
      const a = await repo.getAll();
      const b = await repo.getAll();
      expect(a).not.toBe(b);
    });
  });

  describe('updateStatus', () => {
    it('aktualisiert den Status einer Bestellung (pending → confirmed)', async () => {
      const order = await repo.create(makeOrderData({ status: 'pending' }));
      const updated = await repo.updateStatus(order.id, 'confirmed');
      expect(updated?.status).toBe('confirmed');
    });

    it('aktualisiert den Status (confirmed → shipped)', async () => {
      const order = await repo.create(makeOrderData({ status: 'pending' }));
      await repo.updateStatus(order.id, 'confirmed');
      const updated = await repo.updateStatus(order.id, 'shipped');
      expect(updated?.status).toBe('shipped');
    });

    it('aktualisiert den Status (shipped → delivered)', async () => {
      const order = await repo.create(makeOrderData({ status: 'pending' }));
      await repo.updateStatus(order.id, 'confirmed');
      await repo.updateStatus(order.id, 'shipped');
      const updated = await repo.updateStatus(order.id, 'delivered');
      expect(updated?.status).toBe('delivered');
    });

    it('erlaubt Stornierung einer pending-Bestellung', async () => {
      const order = await repo.create(makeOrderData({ status: 'pending' }));
      const updated = await repo.updateStatus(order.id, 'cancelled');
      expect(updated?.status).toBe('cancelled');
    });

    it('wirft Fehler bei ungültigem Statusübergang', async () => {
      const order = await repo.create(makeOrderData({ status: 'pending' }));
      await expect(repo.updateStatus(order.id, 'delivered')).rejects.toThrow(
        'Ungültiger Statusübergang'
      );
    });

    it('wirft Fehler bei Übergang aus delivered', async () => {
      const order = await repo.create(makeOrderData({ status: 'pending' }));
      await repo.updateStatus(order.id, 'confirmed');
      await repo.updateStatus(order.id, 'shipped');
      await repo.updateStatus(order.id, 'delivered');
      await expect(repo.updateStatus(order.id, 'shipped')).rejects.toThrow(
        'Ungültiger Statusübergang'
      );
    });

    it('gibt null zurück bei unbekannter Bestell-ID', async () => {
      const result = await repo.updateStatus('nonexistent-id', 'confirmed');
      expect(result).toBeNull();
    });
  });
});
