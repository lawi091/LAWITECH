export interface VaultItem {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'address' | 'payment';
  category: string;
}

export interface BrowsingHistory {
  id: string;
  url: string;
  timestamp: number;
  encryptedUrl: string;
  trackersBlocked: number;
}

export interface UserSettings {
  isVaultLocked: boolean;
  autoLockTimer: number; // minutes
  blockTrackers: boolean;
}
