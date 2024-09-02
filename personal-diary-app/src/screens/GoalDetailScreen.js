import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import GoalProgressBar from '../components/GoalProgressBar';
import { getGoalById, updateGoal } from '../services/apiService'; // Importing your API service

const GoalDetailScreen = ({ route, navigation }) => {
  const { goalId } = route.params; // Assuming you pass the goal ID from the previous screen
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const fetchedGoal = await getGoalById(goalId); // Fetching goal details from the backend
        setGoal(fetchedGoal);
      } catch (error) {
        console.error('Error fetching goal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId]);

  const handleMilestoneToggle = (milestoneId) => {
    const updatedMilestones = goal.milestones.map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone
    );
    setGoal({ ...goal, milestones: updatedMilestones });

    // Update the goal on the backend
    updateGoal(goal.id, { milestones: updatedMilestones }).catch((error) => {
      console.error('Error updating goal:', error);
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const renderMilestoneItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMilestoneToggle(item.id)}>
      <View style={styles.milestoneItem}>
        <Text style={[styles.milestoneText, item.completed && styles.completedMilestone]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.goalTitle}>{goal.title}</Text>
      <GoalProgressBar progress={goal.progress} />
      <FlatList
        data={goal.milestones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMilestoneItem}
      />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AddEditGoal', { goal })}
      >
        <Text style={styles.editButtonText}>Edit Goal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  milestoneItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  milestoneText: {
    fontSize: 16,
    color: '#333',
  },
  completedMilestone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  editButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoalDetailScreen;
