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

type RouteProps = RouteProp<RootStackParamList, 'AssignmentDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AssignmentDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { assignments, toggleAssignmentStatus } = useApp();

  const { assignmentId } = route.params;
  const assignment = assignments.find(a => a.id === assignmentId);

  if (!assignment) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Không tìm thấy thông tin bài tập!</Text>
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
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.badgeRow}>
          <Badge
            label={assignment.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            variant={assignment.isCompleted ? 'success' : 'danger'}
          />
          <Badge
            label={`Độ ưu tiên: ${assignment.priority}`}
            variant={
              assignment.priority === 'Cao'
                ? 'danger'
                : assignment.priority === 'Trung bình'
                ? 'warning'
                : 'neutral'
            }
          />
        </View>

        <Text style={styles.assignmentTitle}>{assignment.title}</Text>
        <Text style={styles.subjectName}>📚 Môn học: {assignment.subjectName}</Text>
      </View>

      {/* Thông tin hạn nộp & trạng thái */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thời hạn & Trạng thái</Text>
      </View>

      <Card>
        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>⏰</Text>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Hạn nộp bài tập</Text>
            <Text style={styles.metaValueDeadline}>{assignment.deadline}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.metaRow}>
          <Text style={styles.metaIcon}>📌</Text>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Trạng thái hiện tại</Text>
            <Text style={styles.metaValue}>
              {assignment.isCompleted ? '✅ Bạn đã hoàn thành bài tập này' : '⏳ Chưa hoàn thành - Đang chờ nộp'}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Nút bấm cập nhật trạng thái */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            assignment.isCompleted ? styles.toggleBtnComplete : styles.toggleBtnPending,
          ]}
          onPress={() => toggleAssignmentStatus(assignment.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.toggleBtnIcon}>
            {assignment.isCompleted ? '↩️' : '✓'}
          </Text>
          <Text style={styles.toggleBtnText}>
            {assignment.isCompleted
              ? 'Đánh dấu bài tập chưa hoàn thành'
              : 'Đánh dấu đã hoàn thành bài tập này'}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Yêu cầu chi tiết */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mô tả & Hướng dẫn làm bài</Text>
      </View>

      <Card>
        <Text style={styles.descriptionText}>{assignment.description}</Text>

        <Text style={styles.reqHeader}>Các tiêu chí đánh giá / Checklist:</Text>
        {assignment.requirements.map((req, index) => (
          <View key={index} style={styles.reqItem}>
            <Text style={styles.reqBullet}>▫️</Text>
            <Text style={styles.reqText}>{req}</Text>
          </View>
        ))}
      </Card>

      {/* Nút liên kết đến môn học */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.subjectDetailBtn}
          onPress={() =>
            navigation.navigate('SubjectDetail', { subjectId: assignment.subjectId })
          }
        >
          <Text style={styles.subjectDetailBtnText}>
            📖 Xem thông tin môn học liên quan →
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
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 12,
    lineHeight: 24,
  },
  subjectName: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 6,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  metaIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  metaValueDeadline: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  toggleBtnPending: {
    backgroundColor: '#10B981',
  },
  toggleBtnComplete: {
    backgroundColor: '#6B7280',
  },
  toggleBtnIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
    marginRight: 8,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  reqHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 14,
    marginBottom: 8,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  reqBullet: {
    fontSize: 12,
    marginRight: 8,
    marginTop: 2,
  },
  reqText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
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
