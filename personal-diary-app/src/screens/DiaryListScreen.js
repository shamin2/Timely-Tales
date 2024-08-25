// DiaryListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import EntryCard from '../components/EntryCard';
import { FontAwesome } from '@expo/vector-icons';

const DiaryListScreen = () => {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://your-backend-url.com/api/diary');
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  const filteredEntries = entries.filter(entry => {
    if (filter === 'Favorites') return entry.isFavorite;
    if (filter === 'Work' || filter === 'Travel' || filter === 'Daily Life') return entry.tags.includes(filter);
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Diary</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditEntry')}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        {['All', 'Favorites', 'Work', 'Travel', 'Daily Life'].map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.filterButton, filter === tag ? styles.selectedFilter : null]}
            onPress={() => setFilter(tag)}
          >
            <Text style={styles.filterText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => navigation.navigate('AddEditEntry', { entry: item })}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#6200ee',
    borderWidth: 1,
  },
  selectedFilter: {
    backgroundColor: '#6200ee',
  },
  filterText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default DiaryListScreen;
