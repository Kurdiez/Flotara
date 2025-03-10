import type { Session } from "@shopify/shopify-app-remix/server";
import type { SessionStorage } from "@shopify/shopify-app-session-storage";

const API_BASE_URL = process.env.FLOTARA_API_URL || "http://localhost:3000";

// 서버에서 받아온 세션 데이터에 isActive 메서드를 추가하는 함수
function addIsActiveToSession(sessionData: any): Session {
  return {
    ...sessionData,
    isActive: () => {
      // accessToken이 없으면 세션이 유효하지 않음
      if (!sessionData.accessToken) return false;
      // expires가 있고 현재 시간이 expires를 지났으면 세션이 유효하지 않음
      if (sessionData.expires && new Date() > new Date(sessionData.expires))
        return false;
      return true;
    },
  };
}

export class CustomSessionStorage implements SessionStorage {
  async storeSession(session: Session): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error(`Failed to store session: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async loadSession(id: string): Promise<Session | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`Failed to load session: ${response.statusText}`);
      }

      const sessionData = await response.json();
      if (!sessionData) return undefined;

      return addIsActiveToSession(sessionData);
    } catch (error) {
      return undefined;
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete session: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    try {
      const deletePromises = ids.map((id) => this.deleteSession(id));
      const results = await Promise.all(deletePromises);
      return results.every((result) => result === true);
    } catch (error) {
      return false;
    }
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions?shop=${encodeURIComponent(shop)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to find sessions: ${response.statusText}`);
      }

      const sessionsData = await response.json();
      return sessionsData.map(addIsActiveToSession);
    } catch (error) {
      return [];
    }
  }
}
