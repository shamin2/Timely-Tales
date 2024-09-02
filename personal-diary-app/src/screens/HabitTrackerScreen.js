// HabitTrackerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Platform, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getHabits, createHabit, updateHabit } from '../services/apiService'; // Importing API functions
import * as Animatable from 'react-native-animatable';

const HabitTrackerScreen = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const data = await getHabits(); // Fetching habits from the backend
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      Alert.alert('Error', 'Failed to load habits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async () => {
    if (newHabit.trim() && goal) {
      const newHabitObj = {
        name: newHabit,
        progress: 0,
        goal: parseInt(goal),
        streak: 0, // Streak counter for consecutive days
      };
      try {
        const createdHabit = await createHabit(newHabitObj); // Save the new habit to the backend
        setHabits([...habits, createdHabit]);
        setNewHabit('');
        setGoal('');
      } catch (error) {
        console.error('Error adding habit:', error);
        Alert.alert('Error', 'Failed to add habit. Please try again.');
      }
    }
  };

  const incrementProgress = async (id) => {
    const habit = habits.find(habit => habit.id === id);
    if (!habit) return;

    const updatedHabit = {
      ...habit,
      progress: habit.progress < habit.goal ? habit.progress + 1 : habit.progress,
      streak: habit.progress + 1 === habit.goal ? habit.streak + 1 : habit.streak,
    };

    try {
      await updateHabit(id, updatedHabit); // Update the habit in the backend
      setHabits(
        habits.map((habit) =>
          habit.id === id ? updatedHabit : habit
        )
      );
      if (updatedHabit.progress === updatedHabit.goal) {
        setShowReward(true);
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit. Please try again.');
    }
  };

  const renderReward = () => {
    return showReward ? (
      <Animatable.View animation="bounceIn" style={styles.rewardContainer}>
        <Text style={styles.rewardText}>🎉 Congratulations! You reached your goal! 🎉</Text>
      </Animatable.View>
    ) : null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker</Text>
      {renderReward()}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Habit"
          value={newHabit}
          onChangeText={setNewHabit}
        />
        <TextInput
          style={styles.input}
          placeholder="Goal (e.g., 7 days)"
          keyboardType="numeric"
          value={goal}
          onChangeText={setGoal}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <FontAwesome name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitCard}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.habitProgress}>
                {item.progress}/{item.goal}
              </Text>
            </View>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={item.progress / item.goal}
              color="#6200ee"
              style={styles.progressBar}
            />
            <Text style={styles.streak}>🔥 Streak: {item.streak} days</Text>
            <TouchableOpacity
              style={[styles.progressButton, item.progress >= item.goal ? styles.completed : null]}
              onPress={() => incrementProgress(item.id)}
            >
              <Text style={styles.progressText}>
                {item.progress >= item.goal ? 'Completed' : 'Mark Progress'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  habitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  habitProgress: {
    fontSize: 16,
    color: '#6200ee',
  },
  progressBar: {
    marginBottom: 10,
  },
  streak: {
    fontSize: 14,
    color: '#FF6347',
    marginBottom: 10,
  },
  progressButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  completed: {
    backgroundColor: '#32CD32',
  },
  rewardContainer: {
    padding: 20,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HabitTrackerScreen;
