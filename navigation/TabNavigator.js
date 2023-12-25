import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image } from 'react-native';
import ViewScreen from '../screens/Viewscreen';
import AddScreen from '../screens/AddScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
  
            if (route.name === 'View') {
              iconName = require('/Users/mac/Desktop/testApp/AwesomeProject/assets/info.png'); 
            } else if (route.name === 'Add') {
              iconName = require('/Users/mac/Desktop/testApp/AwesomeProject/assets/check-mark.png'); 
            }
  
            return <Image source={iconName} style={{ width: 20, height: 20, tintColor: color, resizeMode: 'contain' }} />;
          },
          headerShown: false, 
        })}
        tabBarOptions={{
          activeTintColor: 'skyblue', // Set the active tab color
          inactiveTintColor: 'gray', // Set the inactive tab color
          labelStyle: {
            fontSize: 12,
            fontWeight: 'bold', // Text bold when selected
          },
          style: {
            borderTopWidth: 1,
            borderTopColor: 'lightgray', // Add a border at the top of the tab bar
            backgroundColor: 'white', // Set the background color of the tab bar
          },
        }}
      >
        <Tab.Screen name="View" component={ViewScreen} />
        <Tab.Screen name="Add" component={AddScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;
