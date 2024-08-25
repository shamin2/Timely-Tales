import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

const AddCourseScreen = ({ navigation, existingClasses }) => {
  const [className, setClassName] = useState('');
  const [location, setLocation] = useState('');
  const [days, setDays] = useState(''); // e.g., "Monday, Wednesday"
  const [time, setTime] = useState(new Date());
  const [packingReminder, setPackingReminder] = useState('');
  
  const handleAddClass = () => {
    if (className.trim() && location && days && time) {
      const formattedTime = moment(time).format('hh:mm A');
      const newClass = {
        id: Math.random().toString(),
        name: className,
        location,
        days,
        time: formattedTime,
        packingReminder,
      };

      // Check for conflicts before adding the class
      if (checkForConflict(newClass)) {
        Alert.alert(
          'Schedule Conflict',
          'This class overlaps with another class. Would you like to ignore, adjust the schedule, or receive suggestions?',
          [
            { text: 'Ignore', onPress: () => addClass(newClass) },
            { text: 'Adjust Schedule', onPress: () => suggestAlternativeTimes(newClass) },
            { text: 'Get Suggestions', onPress: () => showSmartSuggestions(newClass) },
          ]
        );
      } else {
        addClass(newClass);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields to add a class.');
    }
  };

  const addClass = (newClass) => {
    // Your logic to save the class (e.g., to state or backend)
    scheduleClassNotifications(newClass.time, newClass.name);
    Alert.alert('Class Added', `${newClass.name} at ${newClass.location} on ${newClass.days} at ${newClass.time}`);
    navigation.goBack();
  };

  const checkForConflict = (newClass) => {
    return existingClasses.some(existingClass => {
      return (
        existingClass.days === newClass.days &&
        ((moment(newClass.time, 'hh:mm A').isBetween(moment(existingClass.time, 'hh:mm A'), moment(existingClass.endTime, 'hh:mm A'))) ||
          (moment(newClass.endTime, 'hh:mm A').isBetween(moment(existingClass.startTime, 'hh:mm A'), moment(existingClass.endTime, 'hh:mm A'))))
      );
    });
  };

  const scheduleClassNotifications = (classTime, className) => {
    const classDateTime = moment(classTime, 'hh:mm A');

    const oneHourBefore = classDateTime.subtract(1, 'hour').toDate();
    const thirtyMinutesBefore = classDateTime.subtract(30, 'minutes').toDate();
    const tenMinutesBefore = classDateTime.subtract(20, 'minutes').toDate();

    PushNotification.localNotificationSchedule({
      message: `Class Reminder: ${className} starts in 1 hour`,
      date: oneHourBefore,
    });

    PushNotification.localNotificationSchedule({
      message: `Class Reminder: ${className} starts in 30 minutes`,
      date: thirtyMinutesBefore,
    });

    PushNotification.localNotificationSchedule({
      message: `Class Reminder: ${className} starts in 10 minutes`,
      date: tenMinutesBefore,
    });

    // Packing essentials notification if provided
    if (packingReminder.trim()) {
      PushNotification.localNotificationSchedule({
        message: `Reminder: ${packingReminder}`,
        date: oneHourBefore,
      });
    }
  };

  const suggestAlternativeTimes = (newClass) => {
    // Logic to suggest alternative times based on non-conflicting slots
    Alert.alert('Suggested Times', 'Here are some alternative times that don’t conflict...');
  };

  const showSmartSuggestions = (newClass) => {
    // Smart suggestion logic based on historical class trends
    Alert.alert('Smart Suggestions', 'You frequently miss this class. Consider setting earlier reminders.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Class Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter class name"
        value={className}
        onChangeText={setClassName}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter class location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Days</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter days (e.g., Monday, Wednesday)"
        value={days}
        onChangeText={setDays}
      />

      <Text style={styles.label}>Time</Text>
      <DateTimePicker
        value={time}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => setTime(selectedTime || time)}
      />

      <Text style={styles.label}>Packing Reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Bring lab coat for Chemistry"
        value={packingReminder}
        onChangeText={setPackingReminder}
      />

      <Button title="Add Class" onPress={handleAddClass} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

export default AddCourseScreen;
