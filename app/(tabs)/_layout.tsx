import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors } from '@/theme';

function tabIcon(name: keyof typeof Feather.glyphMap, focused: boolean) {
  return (
    <Feather
      color={focused ? colors.text : colors.textMuted}
      name={name}
      size={18}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 6,
        },
        tabBarStyle: {
          backgroundColor: '#f7f4ef',
          borderTopColor: '#e7e5df',
          height: 72,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => tabIcon('home', focused),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused }) => tabIcon('check-circle', focused),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ focused }) => tabIcon('clock', focused),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => tabIcon('trending-up', focused),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => tabIcon('settings', focused),
        }}
      />
    </Tabs>
  );
}
