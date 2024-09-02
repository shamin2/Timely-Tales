// GratitudeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getGratitudeEntries, createGratitudeEntry } from '../services/apiService'; // Importing API functions

const GratitudeScreen = () => {
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGratitudeEntries();
  }, []);

  const fetchGratitudeEntries = async () => {
    setLoading(true);
    try {
      const data = await getGratitudeEntries(); // Fetching entries from the backend
      setGratitudeEntries(data);
    } catch (error) {
      console.error('Error fetching gratitude entries:', error);
      Alert.alert('Error', 'Failed to load gratitude entries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (newEntry.trim()) {
      const entry = {
        content: newEntry,
        date: new Date().toISOString(), // Store date as ISO string
      };
      try {
        const createdEntry = await createGratitudeEntry(entry); // Save the new entry to the backend
        setGratitudeEntries([createdEntry, ...gratitudeEntries]);
        setNewEntry('');
      } catch (error) {
        console.error('Error adding gratitude entry:', error);
        Alert.alert('Error', 'Failed to add gratitude entry. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gratitude Journal</Text>
      <TextInput
        style={styles.input}
        placeholder="What are you grateful for today?"
        value={newEntry}
        onChangeText={setNewEntry}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
        <FontAwesome name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Entry</Text>
      </TouchableOpacity>
      <FlatList
        data={gratitudeEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryContent}>{item.content}</Text>
            <Text style={styles.entryDate}>{new Date(item.date).toDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Start your gratitude journey by adding your first entry!</Text>
        )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  entryContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GratitudeScreen;
