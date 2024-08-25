
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';

const mockTimelineData = [
  { id: '1', date: new Date(2024, 7, 15), event: 'Started a new course: Web Development' },
  { id: '2', date: new Date(2024, 8, 10), event: 'Vacation to the mountains' },
  { id: '3', date: new Date(2024, 9, 5), event: 'Completed my first React Native project' },
];

const TimeLineScreen = () => {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // Load or fetch timeline data (mock data for now)
    setTimelineData(mockTimelineData);
  }, []);

  const renderTimelineItem = ({ item }) => (
    <View style={styles.timelineItem}>
      <View style={styles.iconContainer}>
        <FontAwesome name="circle" size={10} color="#6200ee" />
        <View style={styles.line} />
      </View>
      <View style={styles.eventContainer}>
        <Text style={styles.eventDate}>{format(item.date, 'MMMM d, yyyy')}</Text>
        <Text style={styles.eventText}>{item.event}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Timeline</Text>
      <FlatList
        data={timelineData}
        keyExtractor={(item) => item.id}
        renderItem={renderTimelineItem}
        contentContainerStyle={styles.timelineContainer}
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
    textAlign: 'center',
  },
  timelineContainer: {
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  line: {
    width: 1,
    backgroundColor: '#6200ee',
    flex: 1,
    marginTop: 5,
  },
  eventContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  eventText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TimeLineScreen;
