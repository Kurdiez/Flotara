export interface UserRequestContext {
  userId: string;
}

export interface ShopifySession {
  id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  accessToken: string;
}
