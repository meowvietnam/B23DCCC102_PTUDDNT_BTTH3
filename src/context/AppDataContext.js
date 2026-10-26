import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { getCache, setCache } from '../storage/cache';
import { KEYS } from '../storage/keys';
import * as outbox from '../storage/outbox';
import * as studentService from '../api/studentService';
import * as courseService from '../api/courseService';
import * as sessionService from '../api/sessionService';
import * as assignmentService from '../api/assignmentService';
import * as gradeService from '../api/gradeService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { isOnline } = useNetworkStatus();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pendingMap, setPendingMap] = useState({}); // { [key]: boolean } e.g. { 'assignment:1': true, 'student:1': true }

  // Refresh pending items map from outbox
  const refreshPendingMap = useCallback(async () => {
    try {
      const items = await outbox.getAll();
      const map = {};
      items.forEach(action => {
        if (action.url.includes('/assignments/')) {
          const parts = action.url.split('/');
          const id = parts[parts.length - 1];
          map[`assignment:${id}`] = true;
        } else if (action.url.endsWith('/assignments') && action.method === 'POST') {
          if (action.body && action.body.id) {
            map[`assignment:${action.body.id}`] = true;
          }
        } else if (action.url.includes('/students/')) {
          map['student:1'] = true;
        }
      });
      setPendingMap(map);
    } catch (_) {
      setPendingMap({});
    }
  }, []);

  // Load all data with Cache-First strategy
  const loadAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    // 1. Load from cache first
    try {
      const [cStudent, cCourses, cSessions, cAssignments, cGrades] = await Promise.all([
        getCache(KEYS.CACHE_STUDENT),
        getCache(KEYS.CACHE_COURSES),
        getCache(KEYS.CACHE_SESSIONS),
        getCache(KEYS.CACHE_ASSIGNMENTS),
        getCache(KEYS.CACHE_GRADES),
      ]);

      if (cStudent?.data) setStudent(cStudent.data);
      if (cCourses?.data) setCourses(cCourses.data);
      if (cSessions?.data) setSessions(cSessions.data);
      if (cAssignments?.data) setAssignments(cAssignments.data);
      if (cGrades?.data) setGrades(cGrades.data);

      const latestSavedAt = [
        cStudent?.savedAt,
        cCourses?.savedAt,
        cSessions?.savedAt,
        cAssignments?.savedAt,
        cGrades?.savedAt,
      ].filter(Boolean).sort().reverse()[0];

      if (latestSavedAt) {
        setLastUpdated(latestSavedAt);
        setLoading(false);
      }
    } catch (cacheErr) {
      console.warn('[AppDataContext] Cache read error:', cacheErr);
    }

    await refreshPendingMap();

    // 2. Fetch fresh from Network API if online
    try {
      const [nStudent, nCourses, nSessions, nAssignments, nGrades] = await Promise.all([
        studentService.getById(1),
        courseService.getAll(),
        sessionService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);

      setStudent(nStudent);
      setCourses(nCourses);
      setSessions(nSessions);
      setAssignments(nAssignments);
      setGrades(nGrades);

      const now = new Date().toISOString();
      setLastUpdated(now);
      setError(null);

      // Save to cache
      await Promise.all([
        setCache(KEYS.CACHE_STUDENT, nStudent),
        setCache(KEYS.CACHE_COURSES, nCourses),
        setCache(KEYS.CACHE_SESSIONS, nSessions),
        setCache(KEYS.CACHE_ASSIGNMENTS, nAssignments),
        setCache(KEYS.CACHE_GRADES, nGrades),
      ]);
    } catch (apiErr) {
      console.warn('[AppDataContext] API fetch error:', apiErr?.message || apiErr);
      // If we don't have cached data yet, show error
      setStudent(prev => {
        if (!prev) setError(apiErr);
        return prev;
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshPendingMap]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // A6: Optimistic update for assignment status (with B3 outbox when offline)
  const updateAssignmentStatus = useCallback(async (assignmentId, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    const now = new Date().toISOString();

    // 1. Optimistic UI update
    let previousList = [];
    setAssignments(prev => {
      previousList = prev;
      const updated = prev.map(item => {
        if (String(item.id) === String(assignmentId)) {
          return {
            ...item,
            status: newStatus,
            updatedAt: now,
          };
        }
        return item;
      });
      // Cache immediately
      setCache(KEYS.CACHE_ASSIGNMENTS, updated);
      return updated;
    });

    // 2. Network sync or Outbox enqueue
    if (isOnline) {
      try {
        await assignmentService.update(assignmentId, {
          status: newStatus,
          updatedAt: now,
        });
        await refreshPendingMap();
      } catch (err) {
        // Rollback on failure
        console.warn('[updateAssignmentStatus] Network failed, rolling back:', err);
        setAssignments(previousList);
        await setCache(KEYS.CACHE_ASSIGNMENTS, previousList);
        Alert.alert('Lỗi cập nhật', 'Không thể cập nhật trạng thái bài tập lên máy chủ.');
      }
    } else {
      // Offline: Enqueue to outbox
      try {
        await outbox.enqueue({
          method: 'PATCH',
          url: `/assignments/${assignmentId}`,
          body: {
            status: newStatus,
            updatedAt: now,
          },
          createdAt: now,
        });
        await refreshPendingMap();
      } catch (outboxErr) {
        console.warn('[updateAssignmentStatus] Outbox enqueue failed:', outboxErr);
      }
    }
  }, [isOnline, refreshPendingMap]);

  // A5: Add new assignment (with B3 outbox when offline)
  const createAssignment = useCallback(async (newAssignmentData) => {
    const now = new Date().toISOString();
    const tempId = Date.now();
    
    // Find course details to attach
    const courseObj = courses.find(c => String(c.id) === String(newAssignmentData.courseId));
    const fullAssignment = {
      ...newAssignmentData,
      id: tempId,
      status: 'todo',
      updatedAt: now,
      course: courseObj || null,
    };

    if (isOnline) {
      try {
        const created = await assignmentService.create({
          courseId: Number(newAssignmentData.courseId),
          title: newAssignmentData.title,
          description: newAssignmentData.description || '',
          dueDate: newAssignmentData.dueDate,
          status: 'todo',
          updatedAt: now,
        });
        const createdWithCourse = {
          ...created,
          course: courseObj || null,
        };
        setAssignments(prev => {
          const updated = [createdWithCourse, ...prev];
          setCache(KEYS.CACHE_ASSIGNMENTS, updated);
          return updated;
        });
        return created;
      } catch (err) {
        console.warn('[createAssignment] Network failed:', err);
        throw err;
      }
    } else {
      // Offline: Save locally and enqueue
      setAssignments(prev => {
        const updated = [fullAssignment, ...prev];
        setCache(KEYS.CACHE_ASSIGNMENTS, updated);
        return updated;
      });

      await outbox.enqueue({
        method: 'POST',
        url: '/assignments',
        body: {
          courseId: Number(newAssignmentData.courseId),
          title: newAssignmentData.title,
          description: newAssignmentData.description || '',
          dueDate: newAssignmentData.dueDate,
          status: 'todo',
          updatedAt: now,
        },
        createdAt: now,
      });

      await refreshPendingMap();
      return fullAssignment;
    }
  }, [isOnline, courses, refreshPendingMap]);

  // Update student profile (with B3 outbox when offline)
  const updateStudentProfile = useCallback(async (profileData) => {
    const now = new Date().toISOString();
    const updated = {
      ...(student || {}),
      ...profileData,
      updatedAt: now,
    };

    // Optimistic update
    setStudent(updated);
    await setCache(KEYS.CACHE_STUDENT, updated);

    if (isOnline) {
      try {
        await studentService.update(1, {
          ...profileData,
          updatedAt: now,
        });
        await refreshPendingMap();
      } catch (err) {
        console.warn('[updateStudentProfile] Network failed:', err);
        throw err;
      }
    } else {
      // Offline: Enqueue to outbox
      await outbox.enqueue({
        method: 'PATCH',
        url: '/students/1',
        body: {
          ...profileData,
          updatedAt: now,
        },
        createdAt: now,
      });
      await refreshPendingMap();
    }
    return updated;
  }, [student, isOnline, refreshPendingMap]);

  return (
    <AppDataContext.Provider
      value={{
        student,
        courses,
        sessions,
        assignments,
        grades,
        loading,
        refreshing,
        error,
        lastUpdated,
        pendingMap,
        refreshAll: () => loadAllData(true),
        updateAssignmentStatus,
        createAssignment,
        updateStudentProfile,
        refreshPendingMap,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

export default AppDataContext;
