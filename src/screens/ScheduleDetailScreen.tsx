import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

type RouteProps = RouteProp<RootStackParamList, 'ScheduleDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ScheduleDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { schedules } = useApp();

  const { scheduleId } = route.params;
  const schedule = schedules.find(s => s.id === scheduleId);

  if (!schedule) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Không tìm thấy buổi học!</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.badgeRow}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>{schedule.dayOfWeek}</Text>
          </View>
          <Badge label={schedule.lessonType} variant="warning" />
        </View>

        <Text style={styles.subjectName}>{schedule.subjectName}</Text>
        <Text style={styles.subjectCode}>Mã môn: {schedule.subjectCode}</Text>
      </View>

      {/* Thông tin buổi học */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thông tin chi tiết buổi học</Text>
      </View>

      <Card>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>⏰</Text>
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Thời gian học</Text>
            <Text style={styles.detailValue}>{schedule.time}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Phòng học</Text>
            <Text style={styles.detailValue}>Phòng {schedule.room}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🏛️</Text>
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Địa điểm / Giảng đường</Text>
            <Text style={styles.detailValue}>{schedule.building}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>👨‍🏫</Text>
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Giảng viên phụ trách</Text>
            <Text style={styles.detailValue}>{schedule.lecturer}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📚</Text>
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Hình thức giảng dạy</Text>
            <Text style={styles.detailValue}>
              {schedule.lessonType} (Trực tiếp tại phòng học)
            </Text>
          </View>
        </View>
      </Card>

      {/* Hướng dẫn & Lưu ý */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lưu ý sinh viên</Text>
      </View>

      <Card style={styles.notesCard}>
        <Text style={styles.noteItem}>
          • Sinh viên có mặt tại phòng học trước giờ bắt đầu ít nhất 5 phút.
        </Text>
        <Text style={styles.noteItem}>
          • Mang theo giáo trình, tài liệu bài giảng và thiết bị thực hành theo yêu cầu của giảng viên.
        </Text>
        <Text style={styles.noteItem}>
          • Điểm danh được tính vào 10% điểm chuyên cần tổng kết học phần.
        </Text>
      </Card>

      {/* Button xem môn học */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.subjectDetailBtn}
          onPress={() =>
            navigation.navigate('SubjectDetail', { subjectId: schedule.subjectId })
          }
        >
          <Text style={styles.subjectDetailBtnText}>
            📖 Xem thông tin chi tiết môn học này →
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 36 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerBanner: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 10,
    lineHeight: 26,
  },
  subjectCode: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  notesCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  noteItem: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
    marginVertical: 3,
  },
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  subjectDetailBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  subjectDetailBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
  },
});
