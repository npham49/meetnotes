import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: '@meetnotes:onboarding_complete',
  SYNC_MODE: '@meetnotes:sync_mode',
} as const;

export type SyncMode = 'offline' | 'online';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
    throw error;
  }
}

export async function getSyncMode(): Promise<SyncMode | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_MODE);
    return value as SyncMode | null;
  } catch (error) {
    console.error('Error getting sync mode:', error);
    return null;
  }
}

export async function setSyncMode(mode: SyncMode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_MODE, mode);
  } catch (error) {
    console.error('Error setting sync mode:', error);
    throw error;
  }
}

export async function clearOnboardingData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.ONBOARDING_COMPLETE, STORAGE_KEYS.SYNC_MODE]);
  } catch (error) {
    console.error('Error clearing onboarding data:', error);
    throw error;
  }
}
