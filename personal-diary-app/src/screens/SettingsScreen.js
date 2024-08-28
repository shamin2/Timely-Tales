import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

const SettingsScreen = ({ isDarkTheme, toggleTheme }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Settings</Text>
      
      {/* Theme Toggle */}
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: theme.textColor }]}>Dark Theme</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>

      {/* Add more settings options here to add later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
