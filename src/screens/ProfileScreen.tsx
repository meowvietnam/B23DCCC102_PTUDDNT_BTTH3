import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { profile, academicSummary, updateProfile } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState(profile.fullName);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [phoneInput, setPhoneInput] = useState(profile.phoneNumber);

  const openEditModal = () => {
    setNameInput(profile.fullName);
    setEmailInput(profile.email);
    setPhoneInput(profile.phoneNumber);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) {
      Alert.alert('Lỗi', 'Họ tên không được để trống');
      return;
    }
    if (!emailInput.trim() || !emailInput.includes('@')) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    if (!phoneInput.trim()) {
      Alert.alert('Lỗi', 'Số điện thoại không được để trống');
      return;
    }

    await updateProfile({
      fullName: nameInput.trim(),
      email: emailInput.trim(),
      phoneNumber: phoneInput.trim(),
    });

    setModalVisible(false);
    Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân và lưu trữ an toàn!');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Profile Card */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {profile.fullName.split(' ').slice(-1)[0]?.charAt(0) || 'SV'}
          </Text>
        </View>
        <Text style={styles.profileName}>{profile.fullName}</Text>
        <Text style={styles.profileMajor}>{profile.major}</Text>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>MSSV: {profile.studentId}</Text>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={openEditModal}
          activeOpacity={0.8}
        >
          <Text style={styles.editBtnText}>✏️ Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin chi tiết cá nhân */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Thông tin sinh viên</Text>
      </View>

      <Card>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã sinh viên:</Text>
          <Text style={styles.infoValueBold}>{profile.studentId}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Họ và tên:</Text>
          <Text style={styles.infoValue}>{profile.fullName}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Lớp sinh hoạt:</Text>
          <Text style={styles.infoValue}>{profile.className}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngành học:</Text>
          <Text style={styles.infoValue}>{profile.major}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Khoa:</Text>
          <Text style={styles.infoValue}>{profile.faculty}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Khóa học:</Text>
          <Text style={styles.infoValue}>{profile.academicYear}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValueLink}>{profile.email}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số điện thoại:</Text>
          <Text style={styles.infoValue}>{profile.phoneNumber}</Text>
        </View>
      </Card>

      {/* Kết quả học tập tổng quan */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Kết quả học tập tích lũy</Text>
        <Badge
          label={`Xếp loại: ${academicSummary.academicClassification}`}
          variant="success"
        />
      </View>

      <Card style={styles.academicCard}>
        <View style={styles.academicGrid}>
          <View style={styles.academicItem}>
            <Text style={styles.academicValText}>
              {academicSummary.gpa4.toFixed(2)}
            </Text>
            <Text style={styles.academicSubText}>Điểm GPA (Hệ 4)</Text>
          </View>

          <View style={styles.academicDivider} />

          <View style={styles.academicItem}>
            <Text style={styles.academicValText}>
              {academicSummary.gpa10.toFixed(2)}
            </Text>
            <Text style={styles.academicSubText}>Điểm GPA (Hệ 10)</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.academicGrid}>
          <View style={styles.academicItem}>
            <Text style={styles.academicValText}>
              {academicSummary.accumulatedCredits} / {academicSummary.totalCredits}
            </Text>
            <Text style={styles.academicSubText}>Tín chỉ tích lũy</Text>
          </View>

          <View style={styles.academicDivider} />

          <View style={styles.academicItem}>
            <Text style={styles.academicValText}>
              {academicSummary.trainingPoint} / 100
            </Text>
            <Text style={styles.academicSubText}>Điểm rèn luyện</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewResultBtn}
          onPress={() => navigation.navigate('AcademicResultDetail')}
          activeOpacity={0.85}
        >
          <Text style={styles.viewResultBtnText}>
            📊 Xem chi tiết bảng điểm và kết quả học tập →
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Modal Chỉnh sửa thông tin */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin cá nhân</Text>
            <Text style={styles.modalSubtitle}>
              Cập nhật họ tên, email và số điện thoại sinh viên
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Họ và tên</Text>
              <TextInput
                style={styles.formInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Nhập họ và tên..."
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email sinh viên</Text>
              <TextInput
                style={styles.formInput}
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Nhập email..."
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.formInput}
                value={phoneInput}
                onChangeText={setPhoneInput}
                keyboardType="phone-pad"
                placeholder="Nhập số điện thoại..."
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Hủy bỏ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={handleSave}
              >
                <Text style={styles.modalSaveText}>Lưu thông tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 36 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
  },
  profileMajor: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  tagBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  infoValueBold: {
    fontSize: 13,
    color: '#1E3A8A',
    fontWeight: '800',
  },
  infoValueLink: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  academicCard: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 3,
    borderTopColor: '#2563EB',
  },
  academicGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
  },
  academicItem: {
    flex: 1,
    alignItems: 'center',
  },
  academicDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
  },
  academicValText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  academicSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  viewResultBtn: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewResultBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 10,
  },
  modalCancelBtn: {
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalSaveBtn: {
    backgroundColor: '#1E3A8A',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
