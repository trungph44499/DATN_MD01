import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Layout/HomeScreen';
import SearchScreen from '../Layout/SearchScreen';
import NoticeScreen from '../Layout/NoticeScreen';
import ProfileScreen from '../Layout/ProfileScreen';
import PlantSceen from '../Layout/PlantSceen';
import ManageUser from '../Layout/ManageUser';
import Payment from '../Layout/Payment';
import DetailProduct from '../Layout/DetailProduct';
import PlantaSceen from '../Layout/PlantaScreen';
import CartScreen from '../Layout/CartScreen';
import Payment2 from '../Layout/Payment2';
import FinalBill from '../Layout/FinalBill';
import AddScreen from '../Layout/AddScreen';
import EditScreen from '../Layout/EditScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Home() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: '#D17842',
            tabBarInactiveBackgroundColor: 'white',
            tabBarActiveBackgroundColor: 'white',
        }}>
            <Tab.Screen name=' ' component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/home1.png')} tintColor={color} />
                }} />

            <Tab.Screen name='  ' component={SearchScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/search1.png')} tintColor={color} />
                }} />

            <Tab.Screen name='   ' component={NoticeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/notification1.png')} tintColor={color} />
                }} />

            <Tab.Screen name='     ' component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../Image/profile1.png')} tintColor={color} />
                }} />
        </Tab.Navigator>
    )
}


const MainNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='ManageUser' component={ManageUser} />
            <Stack.Screen name='Payment' component={Payment} />
            <Stack.Screen name='Payment2' component={Payment2} />
            <Stack.Screen name='DetailProduct' component={DetailProduct} />
            <Stack.Screen name='PlantSceen' component={PlantSceen} />
            <Stack.Screen name='PlantaSceen' component={PlantaSceen} />
            <Stack.Screen name='CartScreen' component={CartScreen} />
            <Stack.Screen name='SearchScreen' component={SearchScreen} />
            <Stack.Screen name='FinalBill' component={FinalBill} />
            <Stack.Screen name='NoticeScreen' component={NoticeScreen} />
            <Stack.Screen name='AddScreen' component={AddScreen}/>
            <Stack.Screen name="EditScreen" component={EditScreen} />
        </Stack.Navigator>
    )
}

export default MainNavigator

const styles = StyleSheet.create({})