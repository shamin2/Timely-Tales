import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import GoalProgressBar from '../components/GoalProgressBar'; // Your existing component

const GoalDetailScreen = ({ route, navigation }) => {
  const { goal } = route.params;

  const renderMilestoneItem = ({ item }) => (
    <View style={styles.milestoneItem}>
      <Text style={[styles.milestoneText, item.completed && styles.completedMilestone]}>
        {item.name}
      </Text>
    </View>
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
});

export default GoalDetailScreen;
