import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabParamList, RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { SubjectsScreen } from '../screens/SubjectsScreen';
import { TimetableScreen } from '../screens/TimetableScreen';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

import { SubjectDetailScreen } from '../screens/SubjectDetailScreen';
import { ScheduleDetailScreen } from '../screens/ScheduleDetailScreen';
import { AssignmentDetailScreen } from '../screens/AssignmentDetailScreen';
import { AcademicResultDetailScreen } from '../screens/AcademicResultDetailScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

interface TabIconProps {
  icon: string;
  focused: boolean;
  label: string;
}

const TabIconComponent: React.FC<TabIconProps> = ({ icon, focused, label }) => {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E3A8A',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
        },
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Tổng quan',
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ focused }) => (
            <TabIconComponent icon="🏠" focused={focused} label="Tổng quan" />
          ),
          headerTitle: 'Hệ thống Quản lý Học tập',
        }}
      />
      <Tab.Screen
        name="Subjects"
        component={SubjectsScreen}
        options={{
          title: 'Môn học',
          tabBarLabel: 'Môn học',
          tabBarIcon: ({ focused }) => (
            <TabIconComponent icon="📚" focused={focused} label="Môn học" />
          ),
          headerTitle: 'Danh sách Môn học',
        }}
      />
      <Tab.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{
          title: 'Thời khóa biểu',
          tabBarLabel: 'Thời khóa biểu',
          tabBarIcon: ({ focused }) => (
            <TabIconComponent icon="📅" focused={focused} label="Thời khóa biểu" />
          ),
          headerTitle: 'Thời khóa biểu tuần',
        }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          title: 'Bài tập',
          tabBarLabel: 'Bài tập',
          tabBarIcon: ({ focused }) => (
            <TabIconComponent icon="📝" focused={focused} label="Bài tập" />
          ),
          headerTitle: 'Quản lý Bài tập',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Cá nhân & Kết quả',
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ focused }) => (
            <TabIconComponent icon="👤" focused={focused} label="Cá nhân" />
          ),
          headerTitle: 'Hồ sơ Sinh viên',
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E3A8A',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
        },
        headerBackTitle: 'Quay lại',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SubjectDetail"
        component={SubjectDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
      <Stack.Screen
        name="ScheduleDetail"
        component={ScheduleDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
      <Stack.Screen
        name="AssignmentDetail"
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
      <Stack.Screen
        name="AcademicResultDetail"
        component={AcademicResultDetailScreen}
        options={{ title: 'Chi tiết kết quả học tập' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.7,
  },
  tabIconFocused: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
});
