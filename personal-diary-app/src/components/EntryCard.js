// EntryCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const EntryCard = ({ entry, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{entry.title}</Text>
        {entry.isFavorite && (
          <FontAwesome name="star" size={20} color="#FFD700" style={styles.favoriteIcon} />
        )}
      </View>
      <Text style={styles.tags}>
        {entry.tags && entry.tags.length > 0 ? entry.tags.join(', ') : 'No Tags'}
      </Text>
      <Text style={styles.content} numberOfLines={3}>
        {entry.content}
      </Text>
      <Text style={styles.date}>{new Date(entry.date).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteIcon: {
    marginLeft: 10,
  },
  tags: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default EntryCard;
