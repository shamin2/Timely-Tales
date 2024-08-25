// GratitudeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const GratitudeScreen = () => {
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      const entry = {
        id: Math.random().toString(),
        content: newEntry,
        date: new Date(),
      };
      setGratitudeEntries([entry, ...gratitudeEntries]);
      setNewEntry('');
    }
  };

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
            <Text style={styles.entryDate}>{item.date.toDateString()}</Text>
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
});

export default GratitudeScreen;
