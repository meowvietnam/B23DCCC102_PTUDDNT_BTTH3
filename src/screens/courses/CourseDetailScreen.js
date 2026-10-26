import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import * as courseService from '../../api/courseService';
import * as sessionService from '../../api/sessionService';
import * as assignmentService from '../../api/assignmentService';
import { getCache, setCache } from '../../storage/cache';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { pendingMap, updateAssignmentStatus } = useAppData();

  const [course, setCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cacheKey = `cache:course:${id}`;

  const fetchDetail = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    // 1. Load cache first
    try {
      const cached = await getCache(cacheKey);
      if (cached?.data?.course) {
        setCourse(cached.data.course);
        setSessions(cached.data.sessions || []);
        setAssignments(cached.data.assignments || []);
        setLastUpdated(cached.savedAt);
        setLoading(false);
        navigation.setOptions({ title: cached.data.course.name });
      }
    } catch (_) {}

    // 2. Fetch fresh from API
    try {
      const [c, s, a] = await Promise.all([
        courseService.getById(id),
        sessionService.getByCourseId(id),
        assignmentService.getByCourseId(id),
      ]);

      setCourse(c);
      setSessions(s);
      setAssignments(a);
      const now = new Date().toISOString();
      setLastUpdated(now);
      setError(null);
      navigation.setOptions({ title: c.name });

      // Save to cache
      await setCache(cacheKey, { course: c, sessions: s, assignments: a });
    } catch (err) {
      console.warn(`[CourseDetail] API error for id ${id}:`, err);
      if (!course) {
        setError(err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, cacheKey, navigation, course]);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin môn học…" />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải thông tin môn học.'} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchDetail(true)}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.headerCard}>
          <View style={styles.codeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{course?.code}</Text>
            </View>
            <View style={styles.creditsBadge}>
              <Text style={styles.creditsText}>{course?.credits} Tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.name}>{course?.name}</Text>
          <Text style={styles.semester}>Học kỳ: {course?.semester}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👨‍🏫 Giảng viên:</Text>
            <Text style={styles.infoValue}>{course?.lecturer}</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>📖 Mô tả môn học:</Text>
            <Text style={styles.description}>{course?.description}</Text>
          </View>
        </View>

        <LastUpdatedText timestamp={lastUpdated} />

        {/* Lịch học của môn */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 Lịch học trong tuần</Text>
          <Text style={styles.badgeCount}>{sessions.length}</Text>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Chưa có lịch học cho môn này.</Text>
          </View>
        ) : (
          sessions.map(s => (
            <SessionCard
              key={String(s.id)}
              session={{ ...s, course }}
              onPress={() => navigation.navigate(ROUTES.SESSION_DETAIL, { id: s.id })}
            />
          ))
        )}

        {/* Bài tập của môn */}
        <View style={[styles.sectionHeader, styles.sectionTopMargin]}>
          <Text style={styles.sectionTitle}>📝 Bài tập của môn</Text>
          <Text style={styles.badgeCount}>{assignments.length}</Text>
        </View>

        {assignments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Môn học này chưa có bài tập nào.</Text>
          </View>
        ) : (
          assignments.map(a => (
            <AssignmentItem
              key={String(a.id)}
              assignment={{ ...a, course }}
              pending={Boolean(pendingMap[`assignment:${a.id}`])}
              onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: a.id })}
              onToggleStatus={() => updateAssignmentStatus(a.id, a.status)}
            />
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.infoBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  codeText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  creditsBadge: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  creditsText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  semester: {
    ...typography.caption,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoCol: {
    marginTop: spacing.xs,
  },
  infoLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTopMargin: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  badgeCount: {
    ...typography.captionBold,
    backgroundColor: colors.inputBg,
    color: colors.textSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
