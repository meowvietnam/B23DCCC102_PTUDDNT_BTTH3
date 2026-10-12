import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { Assignment } from '../types';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'pending' | 'completed';

export const AssignmentsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { assignments, toggleAssignmentStatus } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredAssignments = assignments.filter(item => {
    if (filter === 'pending') return !item.isCompleted;
    if (filter === 'completed') return item.isCompleted;
    return true;
  });

  const completedCount = assignments.filter(a => a.isCompleted).length;
  const pendingCount = assignments.length - completedCount;

  const renderAssignmentItem = ({ item }: { item: Assignment }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: item.id })}
    >
      <Card
        style={[
          styles.card,
          item.isCompleted ? styles.completedCard : styles.pendingCard,
        ]}
      >
        <View style={styles.topRow}>
          <Badge
            label={item.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            variant={item.isCompleted ? 'success' : 'danger'}
          />
          <Badge
            label={`Độ ưu tiên: ${item.priority}`}
            variant={
              item.priority === 'Cao'
                ? 'danger'
                : item.priority === 'Trung bình'
                ? 'warning'
                : 'neutral'
            }
          />
        </View>

        <Text
          style={[
            styles.title,
            item.isCompleted && styles.completedTitleText,
          ]}
        >
          {item.title}
        </Text>

        <Text style={styles.subjectText}>📚 Môn: {item.subjectName}</Text>

        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineIcon}>⏰</Text>
          <Text
            style={[
              styles.deadlineText,
              !item.isCompleted && styles.deadlineWarning,
            ]}
          >
            Hạn nộp: {item.deadline}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.statusToggleButton,
              item.isCompleted
                ? styles.btnCompleted
                : styles.btnPending,
            ]}
            onPress={() => toggleAssignmentStatus(item.id)}
          >
            <Text style={styles.checkIcon}>
              {item.isCompleted ? '✓' : '○'}
            </Text>
            <Text
              style={[
                styles.statusToggleText,
                item.isCompleted ? styles.textCompleted : styles.textPending,
              ]}
            >
              {item.isCompleted ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.detailLink}>Chi tiết →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, filter === 'all' && styles.tabButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[styles.tabText, filter === 'all' && styles.tabTextActive]}
          >
            Tất cả ({assignments.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            filter === 'pending' && styles.tabButtonActive,
          ]}
          onPress={() => setFilter('pending')}
        >
          <Text
            style={[
              styles.tabText,
              filter === 'pending' && styles.tabTextActive,
            ]}
          >
            Chưa xong ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            filter === 'completed' && styles.tabButtonActive,
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.tabText,
              filter === 'completed' && styles.tabTextActive,
            ]}
          >
            Đã xong ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={item => item.id}
        renderItem={renderAssignmentItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={filter === 'completed' ? '⏳' : '🎯'}
            title={
              filter === 'completed'
                ? 'Chưa có bài tập nào hoàn thành'
                : 'Không có bài tập nào cần làm'
            }
            message="Hãy tiếp tục theo dõi và hoàn thành các bài tập đúng hạn nhé!"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginVertical: 6,
    borderLeftWidth: 4,
  },
  pendingCard: {
    borderLeftColor: '#EF4444',
  },
  completedCard: {
    borderLeftColor: '#10B981',
    backgroundColor: '#FAFDFB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    lineHeight: 20,
  },
  completedTitleText: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  subjectText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  deadlineIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  deadlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  deadlineWarning: {
    color: '#DC2626',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statusToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  btnPending: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  btnCompleted: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: '800',
    marginRight: 6,
    color: '#2563EB',
  },
  statusToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textPending: {
    color: '#2563EB',
  },
  textCompleted: {
    color: '#4B5563',
  },
  detailLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
});
