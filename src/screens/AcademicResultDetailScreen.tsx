import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { SubjectGrade } from '../types';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const AcademicResultDetailScreen: React.FC = () => {
  const { profile, academicSummary } = useApp();

  const getLetterBadgeVariant = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'warning';
    return 'danger';
  };

  const renderGradeItem = ({ item }: { item: SubjectGrade }) => (
    <Card style={styles.gradeCard}>
      <View style={styles.gradeTopRow}>
        <View style={styles.codeWrap}>
          <Text style={styles.codeText}>{item.subjectCode}</Text>
          <Text style={styles.creditsText}>• {item.credits} TC</Text>
        </View>
        <Badge
          label={`Điểm chữ: ${item.letterGrade}`}
          variant={getLetterBadgeVariant(item.letterGrade)}
        />
      </View>

      <Text style={styles.subjectName}>{item.subjectName}</Text>

      <View style={styles.scoreGrid}>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>Chuyên cần (10%)</Text>
          <Text style={styles.scoreNum}>{item.attendanceScore.toFixed(1)}</Text>
        </View>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>Giữa kỳ (20%)</Text>
          <Text style={styles.scoreNum}>{item.midtermScore.toFixed(1)}</Text>
        </View>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>Cuối kỳ (70%)</Text>
          <Text style={styles.scoreNum}>{item.finalScore.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.summaryScoreRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Hệ 10: </Text>
          <Text style={styles.summaryNum10}>{item.totalScore10.toFixed(1)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Hệ 4: </Text>
          <Text style={styles.summaryNum4}>{item.totalScore4.toFixed(2)}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header Overview Card */}
      <View style={styles.overviewContainer}>
        <View style={styles.studentHeader}>
          <Text style={styles.studentName}>{profile.fullName}</Text>
          <Text style={styles.studentId}>MSSV: {profile.studentId} • {profile.className}</Text>
        </View>

        <View style={styles.statsCardWrapper}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{academicSummary.gpa4.toFixed(2)}</Text>
            <Text style={styles.statLbl}>GPA Hệ 4</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{academicSummary.gpa10.toFixed(2)}</Text>
            <Text style={styles.statLbl}>GPA Hệ 10</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{academicSummary.accumulatedCredits}</Text>
            <Text style={styles.statLbl}>TC Tích lũy</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{academicSummary.trainingPoint}</Text>
            <Text style={styles.statLbl}>Điểm rèn luyện</Text>
          </View>
        </View>
      </View>

      <View style={styles.listHeaderRow}>
        <Text style={styles.listHeaderTitle}>Bảng điểm chi tiết từng học phần</Text>
        <Text style={styles.listHeaderSubtitle}>
          {academicSummary.grades.length} môn đã hoàn thành
        </Text>
      </View>

      <FlatList
        data={academicSummary.grades}
        keyExtractor={item => item.id}
        renderItem={renderGradeItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  overviewContainer: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  studentHeader: {
    marginBottom: 16,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  studentId: {
    fontSize: 13,
    color: '#BFDBFE',
    marginTop: 2,
  },
  statsCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  vDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  statLbl: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  listHeaderRow: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 6,
  },
  listHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  listHeaderSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 24,
  },
  gradeCard: {
    marginVertical: 6,
  },
  gradeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  creditsText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  scoreGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  scoreCol: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  summaryScoreRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryNum10: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
  summaryNum4: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
});
