import React, { useState, useMemo } from 'react';
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
import { Subject } from '../types';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SubjectsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { subjects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const q = searchQuery.toLowerCase().trim();
    return subjects.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.lecturer.toLowerCase().includes(q)
    );
  }, [subjects, searchQuery]);

  const renderSubjectItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
    >
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{item.code}</Text>
          </View>
          <Badge label={`${item.credits} Tín chỉ`} variant="primary" />
        </View>

        <Text style={styles.title}>{item.name}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👨‍🏫</Text>
            <Text style={styles.detailText}>Giảng viên: {item.lecturer}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🏢</Text>
            <Text style={styles.detailText}>Phòng học: {item.classroom}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Tiến độ: {item.progress}%</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
            </View>
          </View>
          <Text style={styles.arrowText}>Chi tiết →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm môn học theo tên hoặc mã môn..."
        onClear={() => setSearchQuery('')}
      />

      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          Tìm thấy <Text style={styles.summaryHighlight}>{filteredSubjects.length}</Text> môn học
        </Text>
        <Text style={styles.semesterTag}>HK 1 • 2026-2027</Text>
      </View>

      <FlatList
        data={filteredSubjects}
        keyExtractor={item => item.id}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="Không tìm thấy môn học nào"
            message={`Không có môn học nào khớp với từ khóa "${searchQuery}". Vui lòng thử từ khóa khác.`}
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
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryHighlight: {
    fontWeight: '700',
    color: '#1E3A8A',
  },
  semesterTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeContainer: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    lineHeight: 22,
  },
  detailsContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  progressSection: {
    flex: 1,
    marginRight: 16,
  },
  progressLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  arrowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
});
