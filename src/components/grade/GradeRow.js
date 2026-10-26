import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {Object} grade - Bắt buộc: { id, course, semester, total, letter }
 * @param {() => void} [onPress]
 */
function GradeRow({ grade, onPress }) {
  if (!grade) return null;

  const courseName = grade.course?.name || `Môn học #${grade.courseId}`;
  const credits = grade.course?.credits || 3;
  const isPass = grade.letter !== 'F';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`Kết quả môn ${courseName}, điểm tổng kết ${grade.total}, điểm chữ ${grade.letter}`}
      accessibilityRole="button"
      style={styles.card}
    >
      <View style={styles.leftCol}>
        <Text style={styles.courseName} numberOfLines={2}>
          {courseName}
        </Text>
        <Text style={styles.creditsText}>Số tín chỉ: {credits} TC</Text>
      </View>

      <View style={styles.rightCol}>
        <View style={[styles.letterBadge, isPass ? styles.badgePass : styles.badgeFail]}>
          <Text style={[styles.letterText, isPass ? styles.letterPass : styles.letterFail]}>
            {grade.letter}
          </Text>
        </View>
        <Text style={styles.totalText}>Tổng kết: {Number(grade.total).toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  courseName: {
    ...typography.subtitle,
    color: colors.text,
  },
  creditsText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  letterBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    minWidth: 40,
    alignItems: 'center',
  },
  badgePass: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
    borderWidth: 1,
  },
  badgeFail: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
    borderWidth: 1,
  },
  letterText: {
    ...typography.bodyBold,
  },
  letterPass: {
    color: colors.success,
  },
  letterFail: {
    color: colors.danger,
  },
  totalText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default React.memo(GradeRow);
