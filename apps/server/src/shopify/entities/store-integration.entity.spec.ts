import { ShopifyStoreIntegration } from './store-integration.entity';

describe('ShopifyStoreIntegration Entity', () => {
  let integration: ShopifyStoreIntegration;

  beforeEach(() => {
    integration = new ShopifyStoreIntegration();
  });

  it('should be defined', () => {
    expect(integration).toBeDefined();
  });

  it('should set properties correctly', () => {
    const testStoreId = 'test-store-123';
    const testSession = { accessToken: 'test-token' };

    integration.storeId = testStoreId;
    integration.session = testSession;

    expect(integration.storeId).toBe(testStoreId);
    expect(integration.session).toEqual(testSession);
  });

  it('should have all required properties', () => {
    const propertyKeys = Object.keys(integration);
    expect(propertyKeys).toEqual(
      expect.arrayContaining(['storeId', 'session', 'createdAt', 'updatedAt']),
    );
  });
});
