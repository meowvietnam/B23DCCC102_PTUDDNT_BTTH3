import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import * as gradeService from '../../api/gradeService';
import { getCache, setCache } from '../../storage/cache';
import { toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GradeDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cacheKey = `cache:grade:${id}`;

  const fetchDetail = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    // 1. Try cache
    try {
      const cached = await getCache(cacheKey);
      if (cached?.data) {
        setGrade(cached.data);
        setLastUpdated(cached.savedAt);
        setLoading(false);
        const title = cached.data.course?.name || 'Chi tiết điểm môn học';
        navigation.setOptions({ title });
      }
    } catch (_) {}

    // 2. Fetch fresh
    try {
      const fresh = await gradeService.getById(id);
      setGrade(fresh);
      const now = new Date().toISOString();
      setLastUpdated(now);
      setError(null);
      const title = fresh.course?.name || 'Chi tiết điểm môn học';
      navigation.setOptions({ title });
      await setCache(cacheKey, fresh);
    } catch (err) {
      console.warn(`[GradeDetail] Error loading id ${id}:`, err);
      if (!grade) {
        setError(err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, cacheKey, navigation, grade]);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết bảng điểm…" />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải chi tiết bảng điểm.'} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  const courseName = grade?.course?.name || `Môn học #${grade?.courseId}`;
  const credits = grade?.course?.credits || 3;
  const scale4Val = toScale4(grade?.total).scale4;

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
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{grade?.course?.code || 'INT'}</Text>
            </View>
            <View style={styles.creditsBadge}>
              <Text style={styles.creditsText}>{credits} Tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.courseName}>{courseName}</Text>
          <Text style={styles.semesterText}>Học kỳ: {grade?.semester}</Text>

          <View style={styles.divider} />

          {/* Breakdown Scores */}
          <Text style={styles.sectionHeading}>Thành phần điểm chi tiết:</Text>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Chuyên cần (10%):</Text>
            <Text style={styles.scoreVal}>{Number(grade?.attendance).toFixed(1)}</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Giữa kỳ (30%):</Text>
            <Text style={styles.scoreVal}>{Number(grade?.midterm).toFixed(1)}</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Thi cuối kỳ (60%):</Text>
            <Text style={styles.scoreVal}>{Number(grade?.final).toFixed(1)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summarySub}>Tổng kết hệ 10</Text>
              <Text style={styles.summaryNum}>{Number(grade?.total).toFixed(2)}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summarySub}>Điểm hệ 4</Text>
              <Text style={styles.summaryNum}>{scale4Val.toFixed(1)}</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summarySub}>Điểm chữ</Text>
              <Text style={[styles.summaryNum, styles.letterText]}>{grade?.letter}</Text>
            </View>
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
  badgeRow: {
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
  courseName: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  semesterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  sectionHeading: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  scoreLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  scoreVal: {
    ...typography.bodyBold,
    color: colors.text,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  summaryBox: {
    alignItems: 'center',
  },
  summarySub: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 4,
  },
  summaryNum: {
    ...typography.h2,
    color: colors.primary,
  },
  letterText: {
    color: colors.success,
  },
});
