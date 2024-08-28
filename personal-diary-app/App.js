import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import all screens
import OnBoardingScreen from './screens/OnBoardingScreen';
import DiaryListScreen from './screens/DiaryListScreen';
import GoalTrackingScreen from './screens/GoalTrackingScreen';
import TaskTrackerScreen from './screens/TaskTrackerScreen';
import HabitTrackerScreen from './screens/HabitTrackerScreen';
import AddEditEntryScreen from './screens/AddEditEntryScreen';
import AddCourseScreen from './screens/AddCourseScreen';
import GratitudeScreen from './screens/GratitudeScreen';
import AddEditGoalScreen from './screens/AddEditGoalScreen';
import GoalDetailScreen from './screens/GoalDetailScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TimeCapsuleScreen from './screens/TimeCapsuleScreen';
import TimeLineScreen from './screens/TimeLineScreen';
import MoodTrackingScreen from './screens/MoodTrackingScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyLaunched');
        if (value == null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking if first launch:', error);
      }
    };

    checkIfFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // Optionally, return a splash screen or loader here while checking
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch && (
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        )}
        <Stack.Screen name="DiaryList" component={DiaryListScreen} />
        <Stack.Screen name="GoalTracking" component={GoalTrackingScreen} />
        <Stack.Screen name="TaskTracker" component={TaskTrackerScreen} />
        <Stack.Screen name="HabitTracker" component={HabitTrackerScreen} />
        <Stack.Screen name="AddEditEntry" component={AddEditEntryScreen} />
        <Stack.Screen name="AddCourse" component={AddCourseScreen} />
        <Stack.Screen name="Gratitude" component={GratitudeScreen} />
        <Stack.Screen name="AddEditGoal" component={AddEditGoalScreen} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="TimeCapsule" component={TimeCapsuleScreen} />
        <Stack.Screen name="TimeLine" component={TimeLineScreen} />
        <Stack.Screen name="MoodTracking" component={MoodTrackingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
