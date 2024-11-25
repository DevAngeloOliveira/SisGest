import { AuthState } from '../types/auth.types';
import { STORAGE_KEYS } from '../../../shared/constants/storage-keys';

export const authStorage = {
  saveState: (state: AuthState) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(state));
  },

  loadState: (): AuthState | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  clearState: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}; 