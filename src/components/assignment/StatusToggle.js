import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {'todo' | 'done'} status - Bắt buộc
 * @param {() => void} onToggle - Bắt buộc
 */
export default function StatusToggle({ status, onToggle }) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      accessibilityLabel={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
      accessibilityRole="button"
      style={[
        styles.button,
        isDone ? styles.buttonDone : styles.buttonTodo,
      ]}
    >
      <Text style={styles.icon}>{isDone ? '✅' : '⭕'}</Text>
      <Text style={[styles.text, isDone ? styles.textDone : styles.textTodo]}>
        {isDone ? 'Đã xong' : 'Cần làm'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    borderWidth: 1,
  },
  buttonTodo: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warning,
  },
  buttonDone: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  text: {
    ...typography.captionBold,
  },
  textTodo: {
    color: colors.warning,
  },
  textDone: {
    color: colors.success,
  },
});
