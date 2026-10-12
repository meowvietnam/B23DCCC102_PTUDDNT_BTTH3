import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { profile, subjects, assignments, academicSummary, toggleAssignmentStatus } = useApp();

  // Các bài tập chưa hoàn thành hoặc sắp đến hạn
  const pendingAssignments = assignments
    .filter(a => !a.isCompleted)
    .slice(0, 3);

  const completedCount = assignments.filter(a => a.isCompleted).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Student Profile Banner */}
      <View style={styles.banner}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile.fullName.split(' ').slice(-1)[0]?.charAt(0) || 'SV'}
          </Text>
        </View>
        <View style={styles.bannerInfo}>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.studentName}>{profile.fullName}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>MSSV: {profile.studentId}</Text>
            </View>
            <Text style={styles.classText}>• {profile.className}</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: '#EEF2FF' }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AcademicResultDetail')}
        >
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statValue}>{academicSummary.gpa4.toFixed(2)}</Text>
          <Text style={styles.statLabel}>GPA (Hệ 4)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Subjects' })}
        >
          <Text style={styles.statIcon}>📚</Text>
          <Text style={styles.statValue}>{subjects.length}</Text>
          <Text style={styles.statLabel}>Môn học kỳ này</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Assignments' })}
        >
          <Text style={styles.statIcon}>📝</Text>
          <Text style={styles.statValue}>
            {assignments.length - completedCount}/{assignments.length}
          </Text>
          <Text style={styles.statLabel}>Bài tập tồn đọng</Text>
        </TouchableOpacity>
      </View>

      {/* Current Subjects Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Môn học đang học</Text>
          <Text style={styles.sectionSubtitle}>Học kỳ 1 • 2026-2027</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Subjects' })}
        >
          <Text style={styles.seeAllText}>Xem tất cả ({subjects.length}) →</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={subjects.slice(0, 3)}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
          >
            <Card style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View style={styles.subjectCodeBadge}>
                  <Text style={styles.subjectCodeText}>{item.code}</Text>
                </View>
                <Badge label={`${item.credits} tín chỉ`} variant="info" />
              </View>
              <Text style={styles.subjectName}>{item.name}</Text>
              <View style={styles.subjectMeta}>
                <Text style={styles.metaText}>👨‍🏫 {item.lecturer}</Text>
                <Text style={styles.metaText}>📍 Phòng {item.classroom}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* Upcoming Assignments Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Bài tập sắp đến hạn</Text>
          <Text style={styles.sectionSubtitle}>Cần hoàn thành sớm</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Assignments' })}
        >
          <Text style={styles.seeAllText}>Xem tất cả →</Text>
        </TouchableOpacity>
      </View>

      {pendingAssignments.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>Tuyệt vời! Bạn không còn bài tập tồn đọng</Text>
        </Card>
      ) : (
        pendingAssignments.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: item.id })}
          >
            <Card style={styles.assignmentCard}>
              <View style={styles.assignmentTop}>
                <Badge
                  label={item.priority === 'Cao' ? 'Ưu tiên cao' : 'Bình thường'}
                  variant={item.priority === 'Cao' ? 'danger' : 'warning'}
                />
                <Text style={styles.deadlineText}>⏰ Hạn: {item.deadline}</Text>
              </View>

              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <Text style={styles.assignmentSubject}>Môn: {item.subjectName}</Text>

              <View style={styles.assignmentFooter}>
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={() => toggleAssignmentStatus(item.id)}
                >
                  <Text style={styles.checkButtonIcon}>◯</Text>
                  <Text style={styles.checkButtonText}>Đánh dấu đã hoàn thành</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  banner: {
    backgroundColor: '#1E3A8A',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: '#93C5FD',
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  idBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  classText: {
    color: '#BFDBFE',
    fontSize: 12,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -16,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  subjectCard: {
    marginVertical: 5,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectCodeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    lineHeight: 20,
  },
  subjectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignmentCard: {
    marginVertical: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  assignmentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  assignmentSubject: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  assignmentFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButtonIcon: {
    fontSize: 16,
    color: '#3B82F6',
    marginRight: 6,
  },
  checkButtonText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
});
