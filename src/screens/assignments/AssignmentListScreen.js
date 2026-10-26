import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const FILTER_OPTIONS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chưa xong', value: 'TODO' },
  { label: 'Đã xong', value: 'DONE' },
  { label: 'Quá hạn', value: 'OVERDUE' },
];

export default function AssignmentListScreen() {
  const navigation = useNavigation();
  const {
    assignments,
    loading,
    refreshing,
    error,
    lastUpdated,
    pendingMap,
    refreshAll,
    updateAssignmentStatus,
  } = useAppData();

  const [filter, setFilter] = useState('ALL');

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return (assignments || []).filter(item => {
      const isDone = item.status === 'done';
      const overdue = !isDone && isOverdue(item.dueDate);

      if (filter === 'TODO') return !isDone && !overdue;
      if (filter === 'DONE') return isDone;
      if (filter === 'OVERDUE') return overdue;
      return true;
    });
  }, [assignments, filter]);

  if (loading && (!assignments || assignments.length === 0)) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách bài tập…" />
      </ScreenContainer>
    );
  }

  if (error && (!assignments || assignments.length === 0)) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải danh sách bài tập.'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View style={styles.filterCol}>
          <FilterChips
            options={FILTER_OPTIONS}
            selected={filter}
            onSelect={setFilter}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
          accessibilityLabel="Thêm bài tập mới"
          accessibilityRole="button"
        >
          <Text style={styles.addIcon}>＋</Text>
          <Text style={styles.addText}>Thêm bài</Text>
        </TouchableOpacity>
      </View>

      <LastUpdatedText timestamp={lastUpdated} />

      <FlatList
        data={filteredAssignments}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={Boolean(pendingMap[`assignment:${item.id}`])}
            onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })}
            onToggleStatus={() => updateAssignmentStatus(item.id, item.status)}
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
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập nào"
            description={
              filter !== 'ALL'
                ? 'Không có bài tập phù hợp với bộ lọc hiện tại.'
                : 'Bạn chưa có bài tập nào cần làm.'
            }
            actionLabel={filter !== 'ALL' ? 'Xem tất cả' : 'Thêm bài tập mới'}
            onAction={
              filter !== 'ALL'
                ? () => setFilter('ALL')
                : () => navigation.navigate(ROUTES.ASSIGNMENT_FORM)
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  filterCol: {
    flex: 1,
  },
  addButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 22,
    marginRight: spacing.lg,
  },
  addIcon: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginRight: spacing.xs,
  },
  addText: {
    ...typography.captionBold,
    color: colors.white,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
});
