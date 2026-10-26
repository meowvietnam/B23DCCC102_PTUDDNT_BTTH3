import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import * as sessionService from '../../api/sessionService';
import { getCache, setCache } from '../../storage/cache';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAY_LABELS = {
  2: 'Thứ Hai',
  3: 'Thứ Ba',
  4: 'Thứ Tư',
  5: 'Thứ Năm',
  6: 'Thứ Sáu',
  7: 'Thứ Bảy',
  8: 'Chủ Nhật',
};

export default function SessionDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cacheKey = `cache:session:${id}`;

  const fetchDetail = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    // 1. Cache first
    try {
      const cached = await getCache(cacheKey);
      if (cached?.data) {
        setSession(cached.data);
        setLastUpdated(cached.savedAt);
        setLoading(false);
        const title = cached.data.course?.name || 'Chi tiết buổi học';
        navigation.setOptions({ title });
      }
    } catch (_) {}

    // 2. Network API
    try {
      const fresh = await sessionService.getById(id);
      setSession(fresh);
      const now = new Date().toISOString();
      setLastUpdated(now);
      setError(null);
      const title = fresh.course?.name || 'Chi tiết buổi học';
      navigation.setOptions({ title });
      await setCache(cacheKey, fresh);
    } catch (err) {
      console.warn(`[SessionDetail] Error loading id ${id}:`, err);
      if (!session) {
        setError(err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, cacheKey, navigation, session]);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết buổi học…" />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải chi tiết buổi học.'} onRetry={fetchDetail} />
      </ScreenContainer>
    );
  }

  const dayText = DAY_LABELS[session?.dayOfWeek] || `Thứ ${session?.dayOfWeek}`;

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
            <View style={styles.dayBadge}>
              <Text style={styles.dayText}>{dayText}</Text>
            </View>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>
                ⏰ {session?.startTime} - {session?.endTime}
              </Text>
            </View>
          </View>

          <Text style={styles.courseName}>{session?.course?.name}</Text>
          <Text style={styles.codeText}>Mã môn học: {session?.course?.code}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Phòng học:</Text>
            <Text style={styles.infoValue}>{session?.room}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👨‍🏫 Giảng viên:</Text>
            <Text style={styles.infoValue}>{session?.course?.lecturer || 'A B C'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📚 Số tín chỉ:</Text>
            <Text style={styles.infoValue}>{session?.course?.credits || 3} Tín chỉ</Text>
          </View>

          {Boolean(session?.note) && (
            <View style={styles.noteBox}>
              <Text style={styles.noteTitle}>💡 Ghi chú buổi học:</Text>
              <Text style={styles.noteContent}>{session.note}</Text>
            </View>
          )}
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
    marginBottom: spacing.sm,
  },
  dayBadge: {
    backgroundColor: colors.infoBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  dayText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  timeBadge: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  timeText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  courseName: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  codeText: {
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
  infoLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    width: 120,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  noteBox: {
    marginTop: spacing.md,
    backgroundColor: colors.warningBg,
    padding: spacing.md,
    borderRadius: spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  noteTitle: {
    ...typography.bodyBold,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  noteContent: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
});
