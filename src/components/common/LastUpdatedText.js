import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatDate } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {string|Date} [timestamp]
 * @param {any} [style]
 */
export default function LastUpdatedText({ timestamp, style }) {
  if (!timestamp) {
    return null;
  }

  const formatted = formatDate(timestamp, 'full');
  if (!formatted) {
    return null;
  }

  return (
    <Text style={[styles.text, style]}>
      Cập nhật lần cuối: {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
});
