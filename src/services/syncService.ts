export class SyncService {
  private storageKey = '@sisgest:sync';

  async getSyncStatus(): Promise<boolean> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : false;
  }

  async setSyncStatus(status: boolean): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(status));
  }
} 