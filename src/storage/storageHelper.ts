import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentProfile, Assignment } from '../types';

const STORAGE_KEYS = {
  PROFILE: '@student_profile_v2',
  ASSIGNMENTS: '@student_assignments_v2',
};

export const loadProfileFromStorage = async (): Promise<StudentProfile | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Error loading profile from AsyncStorage:', error);
    return null;
  }
};

export const saveProfileToStorage = async (profile: StudentProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.warn('Error saving profile to AsyncStorage:', error);
  }
};

export const loadAssignmentsFromStorage = async (): Promise<Assignment[] | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Error loading assignments from AsyncStorage:', error);
    return null;
  }
};

export const saveAssignmentsToStorage = async (assignments: Assignment[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  } catch (error) {
    console.warn('Error saving assignments to AsyncStorage:', error);
  }
};
