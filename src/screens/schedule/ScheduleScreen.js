import React, { useState, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Determine default day of week: Sunday (0) -> 8, Monday (1) -> 2, etc.
function getDefaultDayOfWeek() {
  const day = new Date().getDay();
  return day === 0 ? 8 : day + 1;
}

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const { sessions, loading, refreshing, error, lastUpdated, refreshAll } = useAppData();

  const [selectedDay, setSelectedDay] = useState(getDefaultDayOfWeek());

  // Filter sessions by selectedDay
  const filteredSessions = useMemo(() => {
    return (sessions || [])
      .filter(s => Number(s.dayOfWeek) === Number(selectedDay))
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [sessions, selectedDay]);

  if (loading && (!sessions || sessions.length === 0)) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải lịch học…" />
      </ScreenContainer>
    );
  }

  if (error && (!sessions || sessions.length === 0)) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải lịch học.'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <DaySelector
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <LastUpdatedText timestamp={lastUpdated} />

      <FlatList
        data={filteredSessions}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          filteredSessions.length > 0 ? (
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>
                Có {filteredSessions.length} buổi học trong ngày
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học"
            description="Bạn không có buổi học nào vào ngày này. Hãy tận dụng thời gian để nghỉ ngơi hoặc làm bài tập nhé!"
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  headerText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
