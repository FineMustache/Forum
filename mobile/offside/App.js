import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';

import LoginScreen from './pages/Login';
import SignUpScreen from './pages/SignUp';
import HomeScreen from './pages/Home';
import PostScreen from './pages/Post';
import ProfileScreen from './pages/Profile';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Home() {
  return (
      <Drawer.Navigator screenOptions={{headerStyle: {backgroundColor: '#161614', borderBottomColor: '#161614'}}}>
        <Drawer.Screen options={{headerTitleStyle: {color: '#ffffff'}, drawerLabelStyle: {color: "#ffffff"}, drawerStyle: {backgroundColor: '#161614'}, drawerActiveBackgroundColor: '#c4a000', drawerActiveTintColor: '#000000'}} name="Feed" component={HomeScreen} />
        <Drawer.Screen options={{headerTitleStyle: {color: '#ffffff'}, drawerLabelStyle: {color: "#ffffff"}, drawerStyle: {backgroundColor: '#161614'}, drawerActiveBackgroundColor: '#c4a000', drawerActiveTintColor: '#000000'}} name="Perfil" component={ProfileScreen} />
      </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#161614', borderBottomColor: '#161614'}}}>
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}, headerShown: false}} name="Home" component={Home}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Login" component={LoginScreen}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Cadastro" component={SignUpScreen}  />
        <Stack.Screen options={{headerTitleStyle: {color: '#ffffff'}}} name="Post" component={PostScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
