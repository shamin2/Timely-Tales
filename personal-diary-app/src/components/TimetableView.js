import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CourseItem from './CourseItem'; // Component to display individual course items

const TimetableView = ({ courses }) => {
  // Helper function to format and group courses by days of the week
  const getCoursesByDay = (day) => {
    return courses.filter(course => course.days.includes(day));
  };

  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {days.map(day => (
          <View key={day} style={styles.column}>
            <Text style={styles.dayHeader}>{day}</Text>
            <View style={styles.courseContainer}>
              {getCoursesByDay(day).map(course => (
                <CourseItem
                  key={course.id}
                  course={course}
                  style={styles.courseItem}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  courseContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseItem: {
    marginBottom: 10,
  },
});

export default TimetableView;
