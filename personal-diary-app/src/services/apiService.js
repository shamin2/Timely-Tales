import axios from 'axios';
import { getData, saveData, removeData } from './storageService';

// Define the base URL for your API
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Function to get the JWT token from AsyncStorage
const getAuthToken = async () => {
  try {
    const token = await getData('jwtToken');
    return token;
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return null;
  }
};

// Create an axios instance with the Authorization header
const apiClient = async () => {
  const token = await getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// User Authentication
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    const { access_token } = response.data;
    await saveData('jwtToken', access_token);
    return access_token;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await removeData('jwtToken');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Diary Entries
export const getEntries = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/entries');
    return response.data;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
};

export const createEntry = async (entryData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/entries', entryData);
    return response.data;
  } catch (error) {
    console.error('Error creating entry:', error);
    throw error;
  }
};

export const updateEntry = async (entryId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/entries/${entryId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

export const deleteEntry = async (entryId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/entries/${entryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};

// Tasks
export const getTasks = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/tasks/${taskId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Goals
export const getGoals = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/goals');
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const createGoal = async (goalData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/goals', goalData);
    return response.data;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const updateGoal = async (goalId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/goals/${goalId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/goals/${goalId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// Habits
export const getHabits = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/habits');
    return response.data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

export const createHabit = async (habitData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/habits', habitData);
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

export const updateHabit = async (habitId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/habits/${habitId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/habits/${habitId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

// Moods
export const getMoods = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/moods');
    return response.data;
  } catch (error) {
    console.error('Error fetching moods:', error);
    throw error;
  }
};

export const createMood = async (moodData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/moods', moodData);
    return response.data;
  } catch (error) {
    console.error('Error creating mood entry:', error);
    throw error;
  }
};

export const updateMood = async (moodId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/moods/${moodId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating mood entry:', error);
    throw error;
  }
};

export const deleteMood = async (moodId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/moods/${moodId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    throw error;
  }
};

// Class Schedules
export const getClassSchedules = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching class schedules:', error);
    throw error;
  }
};

export const createClassSchedule = async (classData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/classes', classData);
    return response.data;
  } catch (error) {
    console.error('Error creating class schedule:', error);
    throw error;
  }
};

export const updateClassSchedule = async (scheduleId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/classes/${scheduleId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating class schedule:', error);
    throw error;
  }
};

export const deleteClassSchedule = async (scheduleId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/classes/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting class schedule:', error);
    throw error;
  }
};

// Gratitude Entries
export const getGratitudeEntries = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/gratitude');
    return response.data;
  } catch (error) {
    console.error('Error fetching gratitude entries:', error);
    throw error;
  }
};

export const createGratitudeEntry = async (entryData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/gratitude', entryData);
    return response.data;
  } catch (error) {
    console.error('Error creating gratitude entry:', error);
    throw error;
  }
};

export const updateGratitudeEntry = async (entryId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/gratitude/${entryId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating gratitude entry:', error);
    throw error;
  }
};

export const deleteGratitudeEntry = async (entryId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/gratitude/${entryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting gratitude entry:', error);
    throw error;
  }
};

// Time Capsules
export const getTimeCapsules = async () => {
  try {
    const client = await apiClient();
    const response = await client.get('/timecapsule');
    return response.data;
  } catch (error) {
    console.error('Error fetching time capsules:', error);
    throw error;
  }
};

export const createTimeCapsule = async (capsuleData) => {
  try {
    const client = await apiClient();
    const response = await client.post('/timecapsule', capsuleData);
    return response.data;
  } catch (error) {
    console.error('Error creating time capsule:', error);
    throw error;
  }
};

export const updateTimeCapsule = async (capsuleId, updatedData) => {
  try {
    const client = await apiClient();
    const response = await client.put(`/timecapsule/${capsuleId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating time capsule:', error);
    throw error;
  }
};

export const deleteTimeCapsule = async (capsuleId) => {
  try {
    const client = await apiClient();
    const response = await client.delete(`/timecapsule/${capsuleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting time capsule:', error);
    throw error;
  }
};
