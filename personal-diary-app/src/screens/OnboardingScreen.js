import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnBoardingScreen = ({ navigation }) => {
  const pages = [
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/onboarding/welcome.png')} style={styles.image} />,
      title: 'Welcome to the Timely-Tales App',
      subtitle: 'Manage your diary, goals, tasks, habits, and more!',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/onboarding/diary.png')} style={styles.image} />,
      title: 'Personal Diary',
      subtitle: 'Record your thoughts, track your moods, and practice gratitude.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/onboarding/goals.png')} style={styles.image} />,
      title: 'Goal Tracking',
      subtitle: 'Set goals, break them into milestones, and track your progress.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/onboarding/tasks.png')} style={styles.image} />,
      title: 'Task Management',
      subtitle: 'Organize your daily tasks, set deadlines, and stay on track.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/onboarding/habits.png')} style={styles.image} />,
      title: 'Habit Tracking',
      subtitle: 'Build and maintain positive habits with daily reminders.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/onboarding/class_schedule.png')} style={styles.image} />,
      title: 'Class Schedule Management',
      subtitle: 'Organize your classes and receive timely reminders.',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('../../assets/onboarding/get_started.png')} style={styles.image} />,
      title: 'Get Started',
      subtitle: 'Let’s begin your journey!',
    },
  ];

  return (
    <Onboarding
      pages={pages}
      onSkip={() => navigation.replace('MainScreen')}
      onDone={() => navigation.replace('MainScreen')}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default OnBoardingScreen;
