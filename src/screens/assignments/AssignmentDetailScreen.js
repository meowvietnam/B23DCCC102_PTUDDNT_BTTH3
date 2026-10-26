import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import StatusToggle from '../../components/assignment/StatusToggle';
import SyncBadge from '../../components/common/SyncBadge';
import * as assignmentService from '../../api/assignmentService';
import { getCache, setCache } from '../../storage/cache';
import { useAppData } from '../../context/AppDataContext';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { assignments, pendingMap, updateAssignmentStatus } = useAppData();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cacheKey = `cache:assignment:${id}`;

  const fetchDetail = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    // 1. Try global assignments first or local cache
    const fromGlobal = (assignments || []).find(a => String(a.id) === String(id));
    if (fromGlobal) {
      setAssignment(fromGlobal);
      setLoading(false);
      navigation.setOptions({ title: fromGlobal.title });
    }

    try {
      const cached = await getCache(cacheKey);
      if (cached?.data) {
        setAssignment(cached.data);
        setLastUpdated(cached.savedAt);
        setLoading(false);
        navigation.setOptions({ title: cached.data.title });
      }
    } catch (_) {}

    // 2. Network API
    try {
      const fresh = await assignmentService.getById(id);
      setAssignment(fresh);
      const now = new Date().toISOString();
      setLastUpdated(now);
      setError(null);
      navigation.setOptions({ title: fresh.title });
      await setCache(cacheKey, fresh);
    } catch (err) {
      console.warn(`[AssignmentDetail] Error loading id ${id}:`, err);
      if (!assignment && !fromGlobal) {
        setError(err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, cacheKey, navigation, assignments, assignment]);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // Keep synced with global assignments state when status toggles
  useEffect(() => {
    const fromGlobal = (assignments || []).find(a => String(a.id) === String(id));
    if (fromGlobal) {
      setAssignment(fromGlobal);
    }
  }, [assignments, id]);

  if (loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải chi tiết bài tập.'} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  const isDone = assignment?.status === 'done';
  const overdue = !isDone && isOverdue(assignment?.dueDate);
  const isPending = Boolean(pendingMap[`assignment:${id}`]);

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
        <View style={[styles.card, overdue && styles.cardOverdue]}>
          <View style={styles.topRow}>
            <Text style={styles.courseName}>
              📚 {assignment?.course?.name || `Môn học #${assignment?.courseId}`}
            </Text>
            <SyncBadge pending={isPending} />
          </View>

          <Text style={styles.title}>{assignment?.title}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏰ Hạn nộp:</Text>
            <Text style={[styles.infoValue, overdue && styles.overdueText]}>
              {formatDate(assignment?.dueDate)} {overdue ? '(Quá hạn)' : ''}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <StatusToggle
              status={assignment?.status || 'todo'}
              onToggle={() => updateAssignmentStatus(id, assignment?.status)}
            />
          </View>

          <View style={styles.descCol}>
            <Text style={styles.descTitle}>📝 Nội dung & Yêu cầu:</Text>
            <Text style={styles.description}>
              {assignment?.description || 'Không có mô tả chi tiết.'}
            </Text>
          </View>
        </View>

        <LastUpdatedText timestamp={lastUpdated} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  card: {
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
  cardOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  courseName: {
    ...typography.captionBold,
    color: colors.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: '700',
  },
  descCol: {
    marginTop: spacing.sm,
    backgroundColor: colors.inputBg,
    padding: spacing.md,
    borderRadius: spacing.xs,
  },
  descTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
