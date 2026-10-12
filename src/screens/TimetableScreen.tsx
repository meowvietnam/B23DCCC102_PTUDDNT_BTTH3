import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { ScheduleItem } from '../types';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS_FILTER = [
  { label: 'Tất cả', value: 0 },
  { label: 'Thứ 2', value: 2 },
  { label: 'Thứ 3', value: 3 },
  { label: 'Thứ 4', value: 4 },
  { label: 'Thứ 5', value: 5 },
  { label: 'Thứ 6', value: 6 },
  { label: 'Thứ 7', value: 7 },
];

export const TimetableScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { schedules } = useApp();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const filteredSchedules = schedules
    .filter(item => selectedDay === 0 || item.dayIndex === selectedDay)
    .sort((a, b) => a.dayIndex - b.dayIndex);

  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: item.id })}
    >
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>{item.dayOfWeek}</Text>
          </View>
          <Badge
            label={item.lessonType}
            variant={
              item.lessonType === 'Thực hành'
                ? 'warning'
                : item.lessonType === 'Bài tập lớn'
                ? 'info'
                : 'primary'
            }
          />
        </View>

        <Text style={styles.subjectName}>{item.subjectName}</Text>
        <Text style={styles.subjectCode}>{item.subjectCode}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏰</Text>
            <Text style={styles.infoText}>{item.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>
              Phòng {item.room} • {item.building}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👨‍🏫</Text>
            <Text style={styles.infoText}>Giảng viên: {item.lecturer}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.tapDetailText}>Nhấn để xem thông tin chi tiết</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Day Filter Horizontal Scroll */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {DAYS_FILTER.map(day => {
            const isSelected = selectedDay === day.value;
            return (
              <TouchableOpacity
                key={day.value}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedDay(day.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.headerCountRow}>
        <Text style={styles.countText}>
          {selectedDay === 0
            ? `Tổng cộng ${filteredSchedules.length} buổi học trong tuần`
            : `Có ${filteredSchedules.length} buổi học vào ngày đã chọn`}
        </Text>
      </View>

      <FlatList
        data={filteredSchedules}
        keyExtractor={item => item.id}
        renderItem={renderScheduleItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🏖️"
            title="Không có buổi học nào"
            message="Bạn không có lịch học nào vào ngày này. Hãy tận dụng thời gian nghỉ ngơi hoặc làm bài tập nhé!"
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
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#1E3A8A',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  headerCountRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  subjectCode: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  infoContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tapDetailText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
});
