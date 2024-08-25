// HabitTrackerScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ProgressBarAndroid, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const HabitTrackerScreen = () => {
  const [habits, setHabits] = useState([
    { id: '1', name: 'Exercise', progress: 3, goal: 7, streak: 2 },
    { id: '2', name: 'Read 30 Minutes', progress: 2, goal: 5, streak: 4 },
  ]);
  const [newHabit, setNewHabit] = useState('');
  const [goal, setGoal] = useState('');
  const [showReward, setShowReward] = useState(false);

  const handleAddHabit = () => {
    if (newHabit.trim() && goal) {
      const newHabitObj = {
        id: Math.random().toString(),
        name: newHabit,
        progress: 0,
        goal: parseInt(goal),
        streak: 0, // Streak counter for consecutive days
      };
      setHabits([...habits, newHabitObj]);
      setNewHabit('');
      setGoal('');
    }
  };

  const incrementProgress = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              progress: habit.progress < habit.goal ? habit.progress + 1 : habit.progress,
              streak: habit.progress + 1 === habit.goal ? habit.streak + 1 : habit.streak,
            }
          : habit
      )
    );
    if (habits.find((habit) => habit.id === id)?.progress + 1 === habits.find((habit) => habit.id === id)?.goal) {
      setShowReward(true);
    }
  };

  const renderReward = () => {
    return showReward ? (
      <Animated.View style={styles.rewardContainer}>
        <Text style={styles.rewardText}>🎉 Congratulations! You reached your goal! 🎉</Text>
      </Animated.View>
    ) : null;
  };

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
});

export default HabitTrackerScreen;
