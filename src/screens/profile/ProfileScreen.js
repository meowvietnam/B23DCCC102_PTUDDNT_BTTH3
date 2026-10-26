import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import AppButton from '../../components/common/AppButton';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SyncBadge from '../../components/common/SyncBadge';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {
    student,
    grades,
    courses,
    loading,
    refreshing,
    error,
    lastUpdated,
    pendingMap,
    refreshAll,
  } = useAppData();

  const gpaStats = useMemo(() => {
    return calcGpa(grades, courses);
  }, [grades, courses]);

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải hồ sơ sinh viên…" />
      </ScreenContainer>
    );
  }

  if (error && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải hồ sơ sinh viên.'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  const isPending = Boolean(pendingMap['student:1']);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
      >
        {/* Profile Header Avatar */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student?.fullName ? student.fullName.split(' ').slice(-1)[0][0] : 'SV'}
            </Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.fullName}>{student?.fullName}</Text>
            <SyncBadge pending={isPending} />
          </View>
          <Text style={styles.majorText}>{student?.major}</Text>
          <Text style={styles.codeBadge}>MSSV: {student?.studentCode}</Text>
        </View>

        {/* GPA Summary Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎯 Kết quả học tập</Text>
        </View>
        <GpaSummary gpa={gpaStats.gpa} totalCredits={gpaStats.accumulatedCredits} />

        <View style={styles.btnRow}>
          <AppButton
            title="📊 Bảng điểm chi tiết"
            variant="outline"
            onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
            style={styles.actionBtn}
          />
        </View>

        {/* Personal Details Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👤 Thông tin cá nhân</Text>
        </View>
        <View style={styles.card}>
          <InfoRow label="Mã sinh viên" value={student?.studentCode} />
          <InfoRow label="Họ và tên" value={student?.fullName} />
          <InfoRow label="Lớp sinh hoạt" value={student?.className} />
          <InfoRow label="Ngành học" value={student?.major} />
          <InfoRow label="Email" value={student?.email} />
          <InfoRow label="Số điện thoại" value={student?.phone} />

          <AppButton
            title="✏️ Chỉnh sửa thông tin"
            variant="primary"
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            style={styles.editBtn}
          />
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
  header: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    ...typography.h1,
    color: colors.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullName: {
    ...typography.h2,
    color: colors.text,
    marginRight: spacing.xs,
  },
  majorText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  codeBadge: {
    ...typography.captionBold,
    color: colors.primary,
    backgroundColor: colors.infoBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.xs,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  btnRow: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  editBtn: {
    marginTop: spacing.lg,
  },
});
