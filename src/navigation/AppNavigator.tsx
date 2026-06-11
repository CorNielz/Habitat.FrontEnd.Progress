import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuthStore } from '../store/useAuthStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
// import { NoteScreen } from '../screens/NoteScreen';
import { EditNoteScreen } from '../screens/EditNoteScreen';
import { CreateNoteScreen } from '../screens/CreateNoteScreen';
// import { CreateNoteScreen } from '../components/CreateNoteScreen';
import { EditHabitScreen } from '../screens/EditHabitScreen';
import { CreateHabitScreen } from '../screens/CreateHabitScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { colors } from '../styles/colors';

const RootStack = createNativeStackNavigator();

export function AppNavigator() {
  const user = useAuthStore((state) => state.user);
  const loaded = useAuthStore((state) => state.loaded);
  const loadSession = useAuthStore((state) => state.loadSession);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen name="NoteDetail" component={EditNoteScreen} />
            <RootStack.Screen name="CreateNote" component={CreateNoteScreen} />
            <RootStack.Screen name="CreateHabit" component={CreateHabitScreen} />
            <RootStack.Screen name="EditNote" component={EditNoteScreen} />
            <RootStack.Screen name="EditHabit" component={EditHabitScreen} />
            <RootStack.Screen name="Settings" component={SettingsScreen} />
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
