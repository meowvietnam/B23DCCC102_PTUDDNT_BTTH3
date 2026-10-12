import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Subjects: undefined;
  Timetable: undefined;
  Assignments: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  SubjectDetail: { subjectId: string };
  ScheduleDetail: { scheduleId: string };
  AssignmentDetail: { assignmentId: string };
  AcademicResultDetail: undefined;
};
