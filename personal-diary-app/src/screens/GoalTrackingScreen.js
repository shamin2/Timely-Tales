import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoalProgressBar from '../components/GoalProgressBar';
import { getGoals } from '../services/apiService'; // Importing your API service

const GoalTrackingScreen = () => {
  const [goals, setGoals] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals(); // Fetching goals from the backend
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, []);

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => navigation.navigate('GoalDetail', { goal: item })}
    >
      <Text style={styles.goalTitle}>{item.title}</Text>
      <GoalProgressBar progress={item.progress} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGoalItem}
      />
    </View>
  );
};

export default GoalTrackingScreen;
