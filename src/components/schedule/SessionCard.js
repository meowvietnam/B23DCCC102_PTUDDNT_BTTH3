import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {Object} session - Bắt buộc: { id, course, startTime, endTime, room, note }
 * @param {() => void} [onPress]
 */
function SessionCard({ session, onPress }) {
  if (!session) return null;

  const courseName = session.course?.name || `Môn học #${session.courseId}`;
  const courseCode = session.course?.code || '';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`Buổi học ${courseName}, lúc ${session.startTime} tại ${session.room}`}
      accessibilityRole="button"
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>
            ⏰ {session.startTime} - {session.endTime}
          </Text>
        </View>
        <View style={styles.roomBadge}>
          <Text style={styles.roomText}>📍 {session.room}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {courseName}
      </Text>

      {Boolean(courseCode) && (
        <Text style={styles.codeText}>Mã môn: {courseCode}</Text>
      )}

      {Boolean(session.note) && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>💡 {session.note}</Text>
        </View>
      )}
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
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  timeBadge: {
    backgroundColor: colors.infoBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  timeText: {
    ...typography.captionBold,
    color: colors.info,
  },
  roomBadge: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  roomText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  codeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  noteBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.warningBg,
    padding: spacing.sm,
    borderRadius: spacing.xs,
  },
  noteText: {
    ...typography.caption,
    color: colors.warning,
  },
});

export default React.memo(SessionCard);
