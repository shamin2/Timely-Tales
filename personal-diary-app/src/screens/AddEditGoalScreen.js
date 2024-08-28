import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const AddEditGoalScreen = ({ route, navigation }) => {
  const { goal } = route.params || {};
  const [title, setTitle] = useState(goal ? goal.title : '');
  const [milestones, setMilestones] = useState(goal ? goal.milestones : []);
  const [newMilestone, setNewMilestone] = useState('');

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones([...milestones, { id: Date.now().toString(), name: newMilestone, completed: false }]);
      setNewMilestone('');
    }
  };

  const handleSaveGoal = () => {
    if (title.trim()) {
      const updatedGoal = {
        id: goal ? goal.id : Date.now().toString(),
        title,
        milestones,
        progress: (milestones.filter(m => m.completed).length / milestones.length) * 100 || 0,
      };
      // Save goal to state or backend here
      Alert.alert('Goal Saved', 'Your goal has been saved successfully!');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please enter a goal title.');
    }
  };

  const toggleMilestoneCompletion = (id) => {
    setMilestones(milestones.map(m => (m.id === id ? { ...m, completed: !m.completed } : m)));
  };

  const renderMilestoneItem = ({ item }) => (
    <TouchableOpacity
      style={styles.milestoneItem}
      onPress={() => toggleMilestoneCompletion(item.id)}
    >
      <Text style={[styles.milestoneText, item.completed && styles.completedMilestone]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Goal Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your goal"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Milestones</Text>
      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMilestoneItem}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a milestone"
        value={newMilestone}
        onChangeText={setNewMilestone}
      />
      <Button title="Add Milestone" onPress={handleAddMilestone} />
      <Button title="Save Goal" onPress={handleSaveGoal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
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
});

export default AddEditGoalScreen;
