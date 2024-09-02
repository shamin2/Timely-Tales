import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, DatePickerAndroid, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { createTimeCapsule, getTimeCapsule } from '../services/apiService'; // Import your API functions

const TimeCapsuleScreen = () => {
  const [message, setMessage] = useState('');
  const [revealDate, setRevealDate] = useState(new Date());
  const [isLocked, setIsLocked] = useState(false);
  const [lockedMessage, setLockedMessage] = useState(null);

  useEffect(() => {
    if (isLocked) {
      fetchLockedMessage();
    }
  }, [isLocked]);

  const handlePickDate = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        setRevealDate(new Date(year, month, day));
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  const handleLockMessage = async () => {
    if (message.trim()) {
      try {
        await createTimeCapsule({ message, revealDate });
        setIsLocked(true);
        Alert.alert('Success', 'Your message has been locked in the time capsule!');
      } catch (error) {
        Alert.alert('Error', 'Failed to lock the message. Please try again.');
      }
    }
  };

  const fetchLockedMessage = async () => {
    try {
      const capsule = await getTimeCapsule(revealDate);
      if (capsule) {
        setLockedMessage(capsule);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve the time capsule. Please try again.');
    }
  };

  const renderLockedMessage = () => {
    const today = new Date();
    if (isLocked && revealDate > today) {
      const timeLeft = Math.ceil((revealDate - today) / (1000 * 60 * 60 * 24)); // Days remaining
      return (
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>Your message is locked until {revealDate.toDateString()}.</Text>
          <Text style={styles.lockedText}>Days Remaining: {timeLeft}</Text>
        </View>
      );
    } else if (isLocked && revealDate <= today && lockedMessage) {
      return (
        <View style={styles.revealedContainer}>
          <Text style={styles.revealedText}>{lockedMessage.message}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Capsule</Text>
      {!isLocked ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Write your message here...."
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.datePickerButton} onPress={handlePickDate}>
            <FontAwesome name="calendar" size={20} color="#6200ee" />
            <Text style={styles.dateText}>{revealDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lockButton} onPress={handleLockMessage}>
            <Text style={styles.lockButtonText}>Lock Message</Text>
          </TouchableOpacity>
        </>
      ) : (
        renderLockedMessage()
      )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6200ee',
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
    color: '#6200ee',
    fontSize: 16,
  },
  lockButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  lockButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockedContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffe4b5',
    borderRadius: 10,
  },
  lockedText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  revealedContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#d3ffd3',
    borderRadius: 10,
  },
  revealedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TimeCapsuleScreen;
