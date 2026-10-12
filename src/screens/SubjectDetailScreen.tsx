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

type RouteProps = RouteProp<RootStackParamList, 'SubjectDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SubjectDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { subjects, schedules, assignments } = useApp();

  const { subjectId } = route.params;
  const subject = subjects.find(s => s.id === subjectId);

  if (!subject) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Không tìm thấy thông tin môn học!</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const relatedSchedules = schedules.filter(sch => sch.subjectId === subject.id);
  const relatedAssignments = assignments.filter(ass => ass.subjectId === subject.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Subject Header Card */}
      <View style={styles.headerBanner}>
        <View style={styles.codeRow}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{subject.code}</Text>
          </View>
          <Badge label={`${subject.credits} Tín chỉ`} variant="primary" />
        </View>

        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.semesterText}>{subject.semester}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Tiến độ môn học</Text>
            <Text style={styles.progressPercent}>{subject.progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${subject.progress}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Main Info */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Thông tin lớp học</Text>
      </View>

      <Card>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>👨‍🏫</Text>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Giảng viên phụ trách</Text>
            <Text style={styles.infoValue}>{subject.lecturer}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Phòng học chính</Text>
            <Text style={styles.infoValue}>Phòng {subject.classroom}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📖</Text>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Mô tả môn học</Text>
            <Text style={styles.descriptionText}>{subject.description}</Text>
          </View>
        </View>
      </Card>

      {/* Lịch học trong tuần */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Lịch học trong tuần</Text>
      </View>

      {relatedSchedules.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>Chưa có lịch xếp cho môn này.</Text>
        </Card>
      ) : (
        relatedSchedules.map(sch => (
          <TouchableOpacity
            key={sch.id}
            onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: sch.id })}
          >
            <Card style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <Text style={styles.scheduleDay}>{sch.dayOfWeek}</Text>
                <Badge label={sch.lessonType} variant="info" />
              </View>
              <Text style={styles.scheduleTime}>⏰ {sch.time}</Text>
              <Text style={styles.scheduleRoom}>📍 Phòng {sch.room} • {sch.building}</Text>
            </Card>
          </TouchableOpacity>
        ))
      )}

      {/* Bài tập liên quan */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Bài tập của môn ({relatedAssignments.length})</Text>
      </View>

      {relatedAssignments.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>Môn học này hiện chưa có bài tập nào.</Text>
        </Card>
      ) : (
        relatedAssignments.map(ass => (
          <TouchableOpacity
            key={ass.id}
            onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: ass.id })}
          >
            <Card style={styles.assignmentCard}>
              <View style={styles.assignmentRow}>
                <Badge
                  label={ass.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                  variant={ass.isCompleted ? 'success' : 'danger'}
                />
                <Text style={styles.assignmentDeadline}>Hạn: {ass.deadline}</Text>
              </View>
              <Text style={styles.assignmentTitle}>{ass.title}</Text>
            </Card>
          </TouchableOpacity>
        ))
      )}

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
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 10,
    lineHeight: 26,
  },
  semesterText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  sectionTitleRow: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  scheduleCard: {
    marginVertical: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduleDay: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  scheduleTime: {
    fontSize: 13,
    color: '#374151',
    marginTop: 2,
  },
  scheduleRoom: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  assignmentCard: {
    marginVertical: 4,
  },
  assignmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  assignmentDeadline: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 8,
  },
});
