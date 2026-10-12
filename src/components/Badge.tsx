import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: '#E6F8F0', text: '#0E9F6E' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'danger':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'info':
        return { bg: '#E0F2FE', text: '#0284C7' };
      case 'neutral':
        return { bg: '#F3F4F6', text: '#4B5563' };
      case 'primary':
      default:
        return { bg: '#EEF2FF', text: '#4F46E5' };
    }
  };

  const current = getBadgeStyle();

  return (
    <View style={[styles.container, { backgroundColor: current.bg }, style]}>
      <Text style={[styles.text, { color: current.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
