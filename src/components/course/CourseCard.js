import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {Object} course - Bắt buộc: { id, code, name, credits, lecturer, semester }
 * @param {() => void} [onPress]
 */
function CourseCard({ course, onPress }) {
  if (!course) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`Môn học ${course.name}, mã ${course.code}`}
      accessibilityRole="button"
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>
        <View style={styles.creditsBadge}>
          <Text style={styles.creditsText}>{course.credits} Tín chỉ</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {course.name}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.lecturerText}>👨‍🏫 {course.lecturer}</Text>
        {Boolean(course.semester) && (
          <Text style={styles.semesterText}>{course.semester}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
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
  title: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  lecturerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  semesterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export default React.memo(CourseCard);
