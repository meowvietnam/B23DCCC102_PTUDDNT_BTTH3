import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function GradeListScreen() {
  const navigation = useNavigation();
  const { grades, courses, loading, refreshing, error, lastUpdated, refreshAll } = useAppData();

  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Semester options for FilterChips
  const semesterOptions = useMemo(() => {
    const list = [{ label: 'Tất cả học kỳ', value: 'ALL' }];
    const set = new Set();
    (grades || []).forEach(g => {
      if (g.semester) set.add(g.semester);
    });
    set.forEach(sem => list.push({ label: sem, value: sem }));
    return list;
  }, [grades]);

  // Filtered grades
  const filteredGrades = useMemo(() => {
    if (selectedSemester === 'ALL') return grades || [];
    return (grades || []).filter(g => g.semester === selectedSemester);
  }, [grades, selectedSemester]);

  // GPA calculation on filtered grades (or all grades)
  const gpaStats = useMemo(() => {
    return calcGpa(filteredGrades, courses);
  }, [filteredGrades, courses]);

  if (loading && (!grades || grades.length === 0)) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải kết quả học tập…" />
      </ScreenContainer>
    );
  }

  if (error && (!grades || grades.length === 0)) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải kết quả học tập.'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <GpaSummary gpa={gpaStats.gpa} totalCredits={gpaStats.accumulatedCredits} />

      <View style={styles.filterWrapper}>
        <FilterChips
          options={semesterOptions}
          selected={selectedSemester}
          onSelect={setSelectedSemester}
        />
      </View>

      <LastUpdatedText timestamp={lastUpdated} />

      <FlatList
        data={filteredGrades}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() => navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })}
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
            title="Không có bảng điểm"
            description="Chưa có dữ liệu điểm cho học kỳ đã chọn."
            actionLabel="Xem tất cả học kỳ"
            onAction={selectedSemester !== 'ALL' ? () => setSelectedSemester('ALL') : undefined}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    marginVertical: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
});
