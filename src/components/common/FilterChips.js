import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * @param {Array<{ label: string, value: any }>} options - Bắt buộc
 * @param {any} selected - Bắt buộc
 * @param {(value: any) => void} onSelect - Bắt buộc
 */
export default function FilterChips({ options = [], selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <TouchableOpacity
            key={String(option.value)}
            activeOpacity={0.7}
            onPress={() => onSelect(option.value)}
            accessibilityLabel={`Lọc theo ${option.label}`}
            accessibilityRole="button"
            style={[
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipDefault,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.chipTextSelected : styles.chipTextDefault,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  chip: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 22,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipDefault: {
    backgroundColor: colors.chipDefault,
  },
  chipSelected: {
    backgroundColor: colors.chipSelected,
  },
  chipText: {
    ...typography.captionBold,
  },
  chipTextDefault: {
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.white,
  },
});
