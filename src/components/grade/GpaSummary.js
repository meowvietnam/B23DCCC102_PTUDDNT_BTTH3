import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {number} gpa - Bắt buộc
 * @param {number} totalCredits - Bắt buộc
 */
export default function GpaSummary({ gpa = 0, totalCredits = 0 }) {
  const formattedGpa = Number(gpa).toFixed(2);

  return (
    <View style={styles.card}>
      <View style={styles.col}>
        <Text style={styles.label}>Điểm GPA (Hệ 4)</Text>
        <Text style={styles.valueGpa}>{formattedGpa}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.col}>
        <Text style={styles.label}>Tín chỉ tích lũy</Text>
        <Text style={styles.valueCredits}>{totalCredits} TC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  col: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  valueGpa: {
    ...typography.h1,
    color: colors.primary,
  },
  valueCredits: {
    ...typography.h2,
    color: colors.text,
  },
});
