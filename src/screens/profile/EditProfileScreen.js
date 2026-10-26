import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { validateStudentProfile } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { student, updateStudentProfile } = useAppData();
  const { isOnline } = useSync();

  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    const validation = validateStudentProfile(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await updateStudentProfile(payload);
      if (!isOnline) {
        Alert.alert(
          'Đã lưu thay đổi offline',
          'Bạn đang offline. Thông tin đã được lưu vào hàng đợi và sẽ tự đồng bộ khi có mạng.'
        );
      } else {
        Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân.');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể cập nhật thông tin cá nhân.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Chỉnh sửa thông tin cá nhân</Text>
        <Text style={styles.formSub}>
          Cập nhật họ tên, email và số điện thoại liên lạc
        </Text>

        <FormInput
          label="Họ và tên (*)"
          value={fullName}
          onChangeText={val => {
            setFullName(val);
            if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
          }}
          placeholder="Nhập họ và tên..."
          error={errors.fullName}
        />

        <FormInput
          label="Địa chỉ Email (*)"
          value={email}
          onChangeText={val => {
            setEmail(val);
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          placeholder="name@student.edu.vn"
          keyboardType="email-address"
          error={errors.email}
        />

        <FormInput
          label="Số điện thoại (*)"
          value={phone}
          onChangeText={val => {
            setPhone(val);
            if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
          }}
          placeholder="0912345678"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <AppButton
          title={isOnline ? 'Lưu thay đổi' : 'Lưu thay đổi (Offline)'}
          variant="primary"
          loading={submitting}
          onPress={handleSave}
          style={styles.saveBtn}
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
  },
  formSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
