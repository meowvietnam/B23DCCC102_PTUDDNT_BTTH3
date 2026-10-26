import React, { useState, useMemo } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import CourseCard from '../../components/course/CourseCard';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function CourseListScreen() {
  const navigation = useNavigation();
  const { courses, loading, refreshing, error, lastUpdated, refreshAll } = useAppData();

  const [search, setSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Extract unique semesters for FilterChips
  const semesterOptions = useMemo(() => {
    const list = [{ label: 'Tất cả học kỳ', value: 'ALL' }];
    const set = new Set();
    (courses || []).forEach(c => {
      if (c.semester) set.add(c.semester);
    });
    set.forEach(sem => list.push({ label: sem, value: sem }));
    return list;
  }, [courses]);

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let result = courses || [];

    if (selectedSemester !== 'ALL') {
      result = result.filter(c => c.semester === selectedSemester);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        c =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.code && c.code.toLowerCase().includes(q)) ||
          (c.lecturer && c.lecturer.toLowerCase().includes(q))
      );
    }

    return result;
  }, [courses, search, selectedSemester]);

  if (loading && (!courses || courses.length === 0)) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách môn học…" />
      </ScreenContainer>
    );
  }

  if (error && (!courses || courses.length === 0)) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải danh sách môn học.'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Tìm kiếm môn học theo tên, mã môn..."
      />

      <View style={styles.filterWrapper}>
        <FilterChips
          options={semesterOptions}
          selected={selectedSemester}
          onSelect={setSelectedSemester}
        />
      </View>

      <LastUpdatedText timestamp={lastUpdated} />

      <FlatList
        data={filteredCourses}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })}
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
            title="Không tìm thấy môn học nào"
            description={
              search
                ? `Không có kết quả phù hợp với từ khóa "${search}".`
                : 'Chưa có môn học nào trong học kỳ này.'
            }
            actionLabel="Xóa bộ lọc"
            onAction={
              search || selectedSemester !== 'ALL'
                ? () => {
                    setSearch('');
                    setSelectedSemester('ALL');
                  }
                : undefined
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    marginBottom: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
});
