import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoalProgressBar from '../components/GoalProgressBar'; // Your existing component

const GoalTrackingScreen = ({ goals }) => {
  const navigation = useNavigation();

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => navigation.navigate('GoalDetail', { goal: item })}
    >
      <Text style={styles.goalTitle}>{item.title}</Text>
      <GoalProgressBar progress={item.progress} /> {/* Reusing your existing component */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  goalItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});

export default GoalTrackingScreen;
