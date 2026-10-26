import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused }) {
  return <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>;
}

export default function AppNavigator() {
  const { assignments } = useAppData();

  // Calculate uncompleted assignments for tabBarBadge
  const uncompletedCount = (assignments || []).filter(a => a.status === 'todo').length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name={ROUTES.TAB_HOME}
        component={HomeStack}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_COURSES}
        component={CourseStack}
        options={{
          tabBarLabel: 'Môn học',
          tabBarIcon: ({ focused }) => <TabIcon icon="📚" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_SCHEDULE}
        component={ScheduleStack}
        options={{
          tabBarLabel: 'Thời khóa biểu',
          tabBarIcon: ({ focused }) => <TabIcon icon="📅" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_ASSIGNMENTS}
        component={AssignmentStack}
        options={{
          tabBarLabel: 'Bài tập',
          tabBarBadge: uncompletedCount > 0 ? uncompletedCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ focused }) => <TabIcon icon="📝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.TAB_PROFILE}
        component={ProfileStack}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.7,
  },
  tabIconFocused: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  badge: {
    backgroundColor: colors.danger,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
