import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { validateAssignment } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

// Helper date generator for easy selection
function getPresetDate(daysAhead) {
  const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  d.setHours(23, 59, 0, 0);
  return d.toISOString();
}

export default function AssignmentFormScreen() {
  const navigation = useNavigation();
  const { courses, createAssignment } = useAppData();
  const { isOnline } = useSync();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(courses?.[0]?.id || 1);
  const [dueDate, setDueDate] = useState(getPresetDate(7));
  const [dueDateText, setDueDateText] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSelectPreset = (days) => {
    const iso = getPresetDate(days);
    setDueDate(iso);
    setDueDateText(new Date(iso).toISOString().slice(0, 10));
    setErrors(prev => ({ ...prev, dueDate: '' }));
  };

  const handleDateTextChange = (text) => {
    setDueDateText(text);
    // Parse date if possible (expected YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      const d = new Date(`${text}T23:59:00Z`);
      if (!isNaN(d.getTime())) {
        setDueDate(d.toISOString());
        setErrors(prev => ({ ...prev, dueDate: '' }));
      }
    }
  };

  const handleSubmit = async () => {
    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      courseId,
    };

    const validation = validateAssignment(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await createAssignment(payload);
      if (!isOnline) {
        Alert.alert(
          'Đã lưu offline',
          'Bạn đang offline. Bài tập đã được thêm vào hàng đợi và sẽ tự động đồng bộ khi có mạng.'
        );
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo bài tập.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Thêm bài tập mới</Text>

        {/* Select Course */}
        <Text style={styles.fieldLabel}>Môn học:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.courseScroll}
          contentContainerStyle={styles.courseScrollContent}
        >
          {(courses || []).map(c => {
            const isSelected = Number(courseId) === Number(c.id);
            return (
              <TouchableOpacity
                key={String(c.id)}
                activeOpacity={0.7}
                onPress={() => setCourseId(c.id)}
                style={[
                  styles.courseChip,
                  isSelected ? styles.courseChipSelected : styles.courseChipDefault,
                ]}
              >
                <Text
                  style={[
                    styles.courseChipText,
                    isSelected ? styles.courseChipTextSelected : styles.courseChipTextDefault,
                  ]}
                >
                  {c.code}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {Boolean(errors.courseId) && (
          <Text style={styles.errorText}>{errors.courseId}</Text>
        )}

        {/* Title Input */}
        <FormInput
          label="Tiêu đề bài tập (*)"
          value={title}
          onChangeText={val => {
            setTitle(val);
            if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
          }}
          placeholder="Nhập tiêu đề bài tập..."
          error={errors.title}
        />

        {/* Description Input */}
        <FormInput
          label="Mô tả / Yêu cầu"
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập chi tiết yêu cầu nộp bài..."
          multiline
          numberOfLines={3}
        />

        {/* Due Date Presets */}
        <Text style={styles.fieldLabel}>Chọn nhanh hạn nộp:</Text>
        <View style={styles.presetsRow}>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => handleSelectPreset(1)}
          >
            <Text style={styles.presetText}>Ngày mai</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => handleSelectPreset(3)}
          >
            <Text style={styles.presetText}>3 ngày tới</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => handleSelectPreset(7)}
          >
            <Text style={styles.presetText}>7 ngày tới</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => handleSelectPreset(14)}
          >
            <Text style={styles.presetText}>2 tuần tới</Text>
          </TouchableOpacity>
        </View>

        {/* Due Date Manual Input */}
        <FormInput
          label="Hạn nộp (YYYY-MM-DD) (*)"
          value={dueDateText}
          onChangeText={handleDateTextChange}
          placeholder="Ví dụ: 2026-11-05"
          error={errors.dueDate}
        />

        <AppButton
          title={isOnline ? 'Lưu bài tập' : 'Lưu bài tập (Offline)'}
          variant="primary"
          loading={submitting}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  courseScroll: {
    marginBottom: spacing.md,
  },
  courseScrollContent: {
    paddingVertical: spacing.xs,
  },
  courseChip: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 22,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseChipDefault: {
    backgroundColor: colors.inputBg,
  },
  courseChipSelected: {
    backgroundColor: colors.primary,
  },
  courseChipText: {
    ...typography.captionBold,
  },
  courseChipTextDefault: {
    color: colors.textSecondary,
  },
  courseChipTextSelected: {
    color: colors.white,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  presetBtn: {
    minHeight: 44,
    minWidth: 44,
    backgroundColor: colors.infoBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
