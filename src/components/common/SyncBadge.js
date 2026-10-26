import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {boolean} [pending=false]
 */
export default function SyncBadge({ pending = false }) {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.badge} accessibilityLabel="Trạng thái chưa đồng bộ">
      <Text style={styles.badgeText}>🔄 Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.warningBg,
    borderColor: colors.syncPending,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...typography.captionBold,
    color: colors.syncPending,
  },
});
