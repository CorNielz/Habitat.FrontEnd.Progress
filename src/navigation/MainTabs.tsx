import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { HabitsListScreen } from '../screens/HabitsListScreen';
import { NotesListScreen } from '../screens/NotesListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
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
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsListScreen}
        options={{
          tabBarLabel: 'Hábitos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesListScreen}
        options={{
          tabBarLabel: 'Anotações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            tabBarLabel: 'Admin',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="shield-checkmark" size={size} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
