import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalProgressBar = ({ progress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>{progress}% Complete</Text>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6200ee',
  },
});

export default GoalProgressBar;
