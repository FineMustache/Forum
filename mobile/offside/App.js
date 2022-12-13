import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import LoginScreen from './pages/Login';
import SignUpScreen from './pages/SignUp';
import HomeScreen from './pages/Home';
import PostScreen from './pages/Post';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#161614', borderBottomColor: '#161614'}}}>
      <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Home" component={HomeScreen}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Login" component={LoginScreen}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Cadastro" component={SignUpScreen}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Post" component={PostScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
