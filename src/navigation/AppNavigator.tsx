import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { NoteScreen } from '../screens/NoteScreen';
import { CreateNoteScreen } from '../components/CreateNoteScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Main" component={HomeScreen} />
                <Stack.Screen name="Note" component={NoteScreen} />
                <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
