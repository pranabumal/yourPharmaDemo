import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { Colors } from '@/constants/theme';
import { useData } from '@/store/data';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type IconColor = ColorValue;

function tabIcon(name: IconName) {
  const TabIcon = ({ color, size }: { color: IconColor; size: number }) => (
    <MaterialCommunityIcons name={name} size={size} color={typeof color === 'string' ? color : undefined} />
  );
  TabIcon.displayName = `TabIcon(${name})`;
  return TabIcon;
}

export default function TabLayout() {
  const { unreadCount } = useData();
  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        sceneStyle: { backgroundColor: Colors.background },
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen name="meds" options={{ title: 'Meds', tabBarIcon: tabIcon('pill') }} />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: tabIcon('message-text-outline'),
          tabBarBadge: unreadCount || undefined,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{ title: 'Appointments', tabBarIcon: tabIcon('calendar-month-outline') }}
      />
      <Tabs.Screen
        name="family"
        options={{ title: 'Family', tabBarIcon: tabIcon('account-group-outline') }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account', tabBarIcon: tabIcon('account-circle-outline') }}
      />
    </Tabs>
  );
}
