import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {Object} assignment - Bắt buộc: { id, title, dueDate, status, course }
 * @param {boolean} [pending=false]
 * @param {() => void} [onPress]
 * @param {() => void} onToggleStatus - Bắt buộc
 */
function AssignmentItem({ assignment, pending = false, onPress, onToggleStatus }) {
  if (!assignment) return null;

  const isDone = assignment.status === 'done';
  const overdue = !isDone && isOverdue(assignment.dueDate);
  const courseName = assignment.course?.name || `Môn học #${assignment.courseId}`;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`Bài tập: ${assignment.title}, hạn nộp ${formatDate(assignment.dueDate)}`}
      accessibilityRole="button"
      style={[
        styles.card,
        isDone && styles.cardDone,
        overdue && styles.cardOverdue,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.courseName} numberOfLines={1}>
          📚 {courseName}
        </Text>
        <SyncBadge pending={pending} />
      </View>

      <Text
        style={[styles.title, isDone && styles.titleDone]}
        numberOfLines={2}
      >
        {assignment.title}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.dateContainer}>
          <Text style={[styles.dueDateText, overdue && styles.dueDateOverdue]}>
            ⏰ Hạn: {formatDate(assignment.dueDate)}
          </Text>
          {overdue && <Text style={styles.overdueBadge}>Quá hạn</Text>}
        </View>

        <StatusToggle
          status={assignment.status}
          onToggle={onToggleStatus}
        />
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
  cardDone: {
    backgroundColor: colors.background,
    opacity: 0.85,
  },
  cardOverdue: {
    borderColor: colors.danger,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  courseName: {
    ...typography.captionBold,
    color: colors.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  dateContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  dueDateText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  dueDateOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
  overdueBadge: {
    ...typography.small,
    color: colors.danger,
    marginTop: 2,
  },
});

export default React.memo(AssignmentItem);
