import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, DatePickerAndroid } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const TimeCapsuleScreen = () => {
  const [message, setMessage] = useState('');
  const [revealDate, setRevealDate] = useState(new Date());
  const [isLocked, setIsLocked] = useState(false);
  const [lockedMessage, setLockedMessage] = useState(null);

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

  const handleLockMessage = () => {
    if (message.trim()) {
      setLockedMessage({ message, revealDate });
      setIsLocked(true);
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
    } else if (isLocked && revealDate <= today) {
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
