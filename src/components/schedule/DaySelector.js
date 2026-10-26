import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { day: 2, label: 'Thứ 2' },
  { day: 3, label: 'Thứ 3' },
  { day: 4, label: 'Thứ 4' },
  { day: 5, label: 'Thứ 5' },
  { day: 6, label: 'Thứ 6' },
  { day: 7, label: 'Thứ 7' },
  { day: 8, label: 'Chủ nhật' },
];

/**
 * @param {number} selectedDay - Bắt buộc (2..8)
 * @param {(day: number) => void} onSelectDay - Bắt buộc
 */
export default function DaySelector({ selectedDay, onSelectDay }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {DAYS.map(item => {
          const isSelected = Number(selectedDay) === item.day;
          return (
            <TouchableOpacity
              key={item.day}
              activeOpacity={0.7}
              onPress={() => onSelectDay(item.day)}
              accessibilityLabel={`Chọn ngày ${item.label}`}
              accessibilityRole="button"
              style={[
                styles.dayButton,
                isSelected ? styles.dayButtonSelected : styles.dayButtonDefault,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected ? styles.dayTextSelected : styles.dayTextDefault,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  container: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  dayButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonDefault: {
    backgroundColor: colors.inputBg,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    ...typography.captionBold,
  },
  dayTextDefault: {
    color: colors.textSecondary,
  },
  dayTextSelected: {
    color: colors.white,
  },
});
