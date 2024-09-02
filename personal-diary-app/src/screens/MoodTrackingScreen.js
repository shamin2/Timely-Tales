import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MoodTrackingChart from '../components/MoodTrackingChart'; // Import the chart component
import { getMoods, createMood } from '../services/apiService'; // Importing API functions

const MoodTrackingScreen = () => {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');
  const [insights, setInsights] = useState({});

  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    calculateInsights();
  }, [moods]);

  const fetchMoods = async () => {
    try {
      const data = await getMoods(); // Fetching moods from the backend
      setMoods(data);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const handleAddMood = async () => {
    if (selectedMood) {
      const newMood = {
        mood: selectedMood,
        note: notes,
        moodIndex: getMoodIndex(selectedMood),
      };

      try {
        const createdMood = await createMood(newMood); // Saving mood to the backend
        setMoods([createdMood, ...moods]); // Updating the local state
        setSelectedMood('');
        setNotes('');
      } catch (error) {
        console.error('Error adding mood:', error);
      }
    }
  };

  const calculateInsights = () => {
    if (moods.length === 0) return;

    // Calculate the most common mood
    const moodFrequency = moods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {});

    const mostCommonMood = Object.keys(moodFrequency).reduce((a, b) =>
      moodFrequency[a] > moodFrequency[b] ? a : b
    );

    // Calculate the average mood index
    const totalMoodIndex = moods.reduce((sum, mood) => sum + mood.moodIndex, 0);
    const averageMoodIndex = (totalMoodIndex / moods.length).toFixed(2);

    // Calculate the best and worst days
    const bestDay = moods.reduce((max, mood) => (mood.moodIndex > max.moodIndex ? mood : max), moods[0]);
    const worstDay = moods.reduce((min, mood) => (mood.moodIndex < min.moodIndex ? mood : min), moods[0]);

    setInsights({
      mostCommonMood,
      averageMoodIndex,
      bestDay: bestDay.date,
      worstDay: worstDay.date,
    });
  };

  const getMoodLabel = (mood) => {
    switch (mood) {
      case '😊':
        return 'Happy';
      case '😟':
        return 'Anxious';
      case '😐':
        return 'Neutral';
      case '😔':
        return 'Sad';
      case '😁':
        return 'Excited';
      default:
        return '';
    }
  };

  const getMoodIndex = (mood) => {
    switch (mood) {
      case '😊':
        return 4;
      case '😁':
        return 5;
      case '😐':
        return 3;
      case '😟':
        return 2;
      case '😔':
        return 1;
      default:
        return 0;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracking</Text>
      <View style={styles.moodPicker}>
        {['😊', '😟', '😐', '😔', '😁'].map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[styles.moodOption, selectedMood === mood && styles.selectedMood]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.moodEmoji}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.notesInput}
        placeholder="Add notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddMood}>
        <FontAwesome name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Mood</Text>
      </TouchableOpacity>
      {/* Integrating the MoodTrackingChart component */}
      <MoodTrackingChart data={moods} />
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Insights</Text>
        <Text style={styles.insightText}>
          Most Common Mood: <Text style={styles.insightHighlight}>{insights.mostCommonMood}</Text>
        </Text>
        <Text style={styles.insightText}>
          Average Mood Index: <Text style={styles.insightHighlight}>{insights.averageMoodIndex}</Text>
        </Text>
        <Text style={styles.insightText}>
          Best Day: <Text style={styles.insightHighlight}>{insights.bestDay}</Text>
        </Text>
        <Text style={styles.insightText}>
          Worst Day: <Text style={styles.insightHighlight}>{insights.worstDay}</Text>
        </Text>
      </View>
      <FlatList
        data={moods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.moodItem}>
            <Text style={styles.moodDate}>{item.date}</Text>
            <Text style={styles.moodLabel}>
              {item.mood} {item.moodLabel}
            </Text>
            <Text style={styles.moodNotes}>{item.notes}</Text>
          </View>
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
  moodPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  moodOption: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedMood: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 28,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    height: 80,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  insightsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  insightHighlight: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  moodItem: {
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
    moodDate: {
      fontSize: 14,
      color: '#888',
      marginBottom: 5,
    },
    moodLabel: {
      fontSize: 16,
      color: '#333',
    },
    moodNotes: {
      fontSize: 14,
      color: '#666',
      marginTop: 5,
    },
  });
  
  export default MoodTrackingScreen;
