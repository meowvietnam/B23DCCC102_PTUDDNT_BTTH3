import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AppButton from '../../components/common/AppButton';
import CourseCard from '../../components/course/CourseCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import { isWithin7Days } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    student,
    courses,
    assignments,
    loading,
    refreshing,
    error,
    lastUpdated,
    pendingMap,
    refreshAll,
    updateAssignmentStatus,
  } = useAppData();

  const { pendingCount, syncing, syncNow, isOnline } = useSync();

  // Filter assignments due in next 7 days
  const upcomingAssignments = (assignments || []).filter(
    a => a.status === 'todo' && isWithin7Days(a.dueDate)
  );

  if (loading && !student && (!courses || courses.length === 0)) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải dữ liệu tổng quan…" />
      </ScreenContainer>
    );
  }

  if (error && !student && (!courses || courses.length === 0)) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể kết nối máy chủ.'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={[]}
        renderItem={null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.content}>
            {/* Student Info Card */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {student?.fullName ? student.fullName.split(' ').slice(-1)[0][0] : 'SV'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.greeting}>Xin chào,</Text>
                <Text style={styles.fullName}>{student?.fullName || 'Sinh viên'}</Text>
                <Text style={styles.studentMeta}>
                  MSSV: {student?.studentCode || 'B23DCCC102'} • {student?.className || 'D23CQCN01-B'}
                </Text>
              </View>
            </View>

            {/* Offline Sync Status Panel */}
            {pendingCount > 0 && (
              <View style={styles.syncAlertCard}>
                <View style={styles.syncAlertTextCol}>
                  <Text style={styles.syncAlertTitle}>
                    Có {pendingCount} thay đổi chưa đồng bộ
                  </Text>
                  <Text style={styles.syncAlertSub}>
                    {isOnline ? 'Đang có mạng, bạn có thể đồng bộ ngay.' : 'Sẽ tự động gửi lên server khi có mạng.'}
                  </Text>
                </View>
                {isOnline && (
                  <AppButton
                    title="Đồng bộ ngay"
                    variant="primary"
                    loading={syncing}
                    onPress={syncNow}
                    style={styles.syncBtn}
                  />
                )}
              </View>
            )}

            <LastUpdatedText timestamp={lastUpdated} style={styles.lastUpdated} />

            {/* Upcoming Assignments Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⏰ Bài tập đến hạn trong 7 ngày tới</Text>
              <Text style={styles.badgeCount}>{upcomingAssignments.length}</Text>
            </View>

            {upcomingAssignments.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>🎉</Text>
                <Text style={styles.emptyText}>
                  Không có bài tập nào đến hạn trong 7 ngày tới!
                </Text>
              </View>
            ) : (
              upcomingAssignments.map(item => (
                <AssignmentItem
                  key={String(item.id)}
                  assignment={item}
                  pending={Boolean(pendingMap[`assignment:${item.id}`])}
                  onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })}
                  onToggleStatus={() => updateAssignmentStatus(item.id, item.status)}
                />
              ))
            )}

            {/* Current Courses Section */}
            <View style={[styles.sectionHeader, styles.sectionTopMargin]}>
              <Text style={styles.sectionTitle}>📚 Môn học đang học</Text>
              <Text style={styles.badgeCount}>{(courses || []).length}</Text>
            </View>

            {(courses || []).slice(0, 3).map(course => (
              <CourseCard
                key={String(course.id)}
                course={course}
                onPress={() => navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })}
              />
            ))}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h2,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
  },
  fullName: {
    ...typography.h2,
    color: colors.text,
  },
  studentMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  syncAlertCard: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncAlertTextCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  syncAlertTitle: {
    ...typography.bodyBold,
    color: colors.warning,
  },
  syncAlertSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  syncBtn: {
    minHeight: 36,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  lastUpdated: {
    marginTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
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
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
