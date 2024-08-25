import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const AddEditEntryScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const existingEntry = route.params?.entry;

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title);
      setContent(existingEntry.content);
      setSelectedTags(existingEntry.tags || []);
      setIsFavorite(existingEntry.isFavorite);
    }
  }, [existingEntry]);

  const handleSaveEntry = async () => {
    const entryData = {
      title,
      content,
      tags: selectedTags,
      isFavorite,
    };

    try {
      if (existingEntry) {
        await axios.put(`http://your-backend-url.com/api/diary/${existingEntry.id}`, entryData);
      } else {
        await axios.post('http://your-backend-url.com/api/diary', entryData);
      }
      navigation.navigate('DiaryList');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{existingEntry ? 'Edit Entry' : 'New Entry'}</Text>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
          <FontAwesome name={isFavorite ? 'star' : 'star-o'} size={28} color={isFavorite ? '#FFD700' : '#ccc'} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Write your diary entry here..."
        value={content}
        onChangeText={setContent}
        multiline
        placeholderTextColor="#888"
      />
      <Text style={styles.label}>Tags:</Text>
      <View style={styles.tagsContainer}>
        {['Work', 'Travel', 'Daily Life'].map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTags.includes(tag) ? styles.selectedTag : null]}
            onPress={() => handleTagSelection(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
        <Text style={styles.saveButtonText}>{existingEntry ? 'Update Entry' : 'Save Entry'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  selectedTag: {
    backgroundColor: '#6200ee',
  },
  tagText: {
    color: '#6200ee',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditEntryScreen;
