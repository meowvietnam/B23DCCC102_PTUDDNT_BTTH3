import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentProfile, Subject, ScheduleItem, Assignment, AcademicSummary } from '../types';
import {
  initialProfile,
  initialSubjects,
  initialSchedules,
  initialAssignments,
  academicSummaryData,
} from '../data/mockData';
import {
  loadProfileFromStorage,
  saveProfileToStorage,
  loadAssignmentsFromStorage,
  saveAssignmentsToStorage,
} from '../storage/storageHelper';

interface AppContextType {
  profile: StudentProfile;
  subjects: Subject[];
  schedules: ScheduleItem[];
  assignments: Assignment[];
  academicSummary: AcademicSummary;
  updateProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  toggleAssignmentStatus: (assignmentId: string) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [schedules] = useState<ScheduleItem[]>(initialSchedules);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [academicSummary] = useState<AcademicSummary>(academicSummaryData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedProfile = await loadProfileFromStorage();
        if (storedProfile) {
          setProfile(storedProfile);
        } else {
          await saveProfileToStorage(initialProfile);
        }

        const storedAssignments = await loadAssignmentsFromStorage();
        if (storedAssignments && storedAssignments.length > 0) {
          setAssignments(storedAssignments);
        } else {
          await saveAssignmentsToStorage(initialAssignments);
        }
      } catch (err) {
        console.warn('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const updateProfile = async (updated: Partial<StudentProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    await saveProfileToStorage(newProfile);
  };

  const toggleAssignmentStatus = async (assignmentId: string) => {
    const updatedAssignments = assignments.map(item => {
      if (item.id === assignmentId) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    setAssignments(updatedAssignments);
    await saveAssignmentsToStorage(updatedAssignments);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        subjects,
        schedules,
        assignments,
        academicSummary,
        updateProfile,
        toggleAssignmentStatus,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
