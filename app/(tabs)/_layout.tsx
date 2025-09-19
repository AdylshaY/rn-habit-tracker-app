import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F5F5F5',
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: '#F5F5F5',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Today's Habits",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name='calendar-today'
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name='streaks'
        options={{
          title: 'Streaks',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='chart-line' size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='add-habit'
        options={{
          title: 'Add Habit',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='plus-circle' size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
