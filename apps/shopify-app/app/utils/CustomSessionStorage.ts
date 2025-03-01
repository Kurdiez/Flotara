import type { Session } from "@shopify/shopify-app-remix/server";
import type { SessionStorage } from "@shopify/shopify-app-session-storage";

export class CustomSessionStorage implements SessionStorage {
  async storeSession(session: Session): Promise<boolean> {
    console.log("📝 Storing session:", {
      id: session.id,
      shop: session.shop,
      state: session.state,
      isOnline: session.isOnline,
      accessToken: session.accessToken,
    });
    return true;
  }

  async loadSession(id: string): Promise<Session | undefined> {
    console.log("🔍 Loading session:", { id });
    // Return undefined to simulate session not found
    return undefined;
  }

  async deleteSession(id: string): Promise<boolean> {
    console.log("🗑️ Deleting session:", { id });
    return true;
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    console.log("🗑️ Deleting multiple sessions:", { ids });
    return true;
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    console.log("🏪 Finding sessions for shop:", { shop });
    return [];
  }
}
