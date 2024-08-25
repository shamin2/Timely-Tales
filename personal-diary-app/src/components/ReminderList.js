import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CourseItem from './CourseItem'; // Reuse the CourseItem component

const ReminderList = ({ reminders }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseItem course={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  separator: {
    height: 10,
  },
});

export default ReminderList;
