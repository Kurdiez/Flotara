import { ShopifyStore } from './store.entity';

describe('ShopifyStore Entity', () => {
  let store: ShopifyStore;

  beforeEach(() => {
    store = new ShopifyStore();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  it('should set storeId correctly', () => {
    const testStoreId = 'test-store-123';
    store.storeId = testStoreId;
    expect(store.storeId).toBe(testStoreId);
  });

  it('should have all required properties', () => {
    const propertyKeys = Object.keys(store);
    expect(propertyKeys).toEqual(
      expect.arrayContaining(['storeId', 'createdAt', 'updatedAt']),
    );
  });
});
