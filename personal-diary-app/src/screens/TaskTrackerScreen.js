import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import { ProgressBar, Calendar } from 'react-native-paper'; // Example for using progress bars and calendar layouts

const TaskTrackerScreen = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Finish project report', category: 'Work', dueDate: '2024-08-30', priority: 'High', completed: false, archived: false },
    { id: '2', title: 'Grocery shopping', category: 'Personal', dueDate: '2024-08-25', priority: 'Medium', completed: false, archived: false },
  ]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  useEffect(() => {
    configureNotifications();
    scheduleTaskNotifications(tasks);
  }, [tasks]);

  const configureNotifications = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification received:', notification);
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  const scheduleTaskNotifications = (tasks) => {
    tasks.forEach((task) => {
      const dueDate = moment(task.dueDate);
      const now = moment();

      // Check if the task is due in the next day
      if (dueDate.diff(now, 'hours') <= 24 && !task.completed) {
        PushNotification.localNotificationSchedule({
          message: `Reminder: The task "${task.title}" is due tomorrow!`,
          date: new Date(Date.now() + 5 * 1000), // Example scheduling
          allowWhileIdle: true,
        });
      }

      // Check if the task is already overdue
      if (dueDate.isBefore(now) && !task.completed) {
        PushNotification.localNotification({
          message: `The task "${task.title}" is overdue! Please complete it as soon as possible.`,
          allowWhileIdle: true,
        });
      }
    });
  };

  const handleAddTask = () => {
    if (newTask.trim() && category && dueDate) {
      const task = {
        id: Math.random().toString(),
        title: newTask,
        category,
        dueDate,
        priority,
        completed: false,
        archived: false,
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setCategory('');
      setDueDate('');
      setPriority('Medium');
    } else {
      Alert.alert('Please fill in all fields to add a task.');
    }
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const handleArchiveTask = (taskId) => {
    const taskToArchive = tasks.find(task => task.id === taskId);
    setArchivedTasks([...archivedTasks, { ...taskToArchive, archived: true }]);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const renderTaskItem = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.completedTask]}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={[styles.taskCategory, styles[`category${item.category}`]]}>
          {item.category} - {item.dueDate}
        </Text>
        <Text style={[styles.taskPriority, styles[`priority${item.priority}`]]}>Priority: {item.priority}</Text>
        <ProgressBar progress={item.completed ? 1 : 0.5} color="#6200ee" style={styles.progressBar} />
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
          <FontAwesome name={item.completed ? 'check-circle' : 'circle-o'} size={24} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleArchiveTask(item.id)} style={styles.archiveButton}>
          <FontAwesome name="archive" size={24} color="#6200ee" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Task Tracker</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TextInput
          style={styles.input}
          placeholder="Category (e.g., Work, Personal)"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date (e.g., 2024-08-30)"
          value={dueDate}
          onChangeText={setDueDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Priority (High, Medium, Low)"
          value={priority}
          onChangeText={setPriority}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Today's Tasks</Text>
      <FlatList
        data={tasks.filter(task => task.dueDate === new Date().toISOString().split('T')[0])}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
      />

      <Text style={styles.sectionTitle}>This Week's Tasks</Text>
      <Calendar /> {/* This is an example, integrate based on your choice of library */}

      <Text style={styles.sectionTitle}>All Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
      />

      <Text style={styles.sectionTitle}>Archived Tasks</Text>
      <FlatList
        data={archivedTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
      />
    </ScrollView>
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completedTask: {
    backgroundColor: '#d3ffd3',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskCategory: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  taskPriority: {
    fontSize: 14,
    color: '#555',
  },
  progressBar: {
    marginTop: 5,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  archiveButton: {
    marginLeft: 15,
  },
  categoryWork: {
    color: '#FF5733', // Color for work-related tasks
  },
  categoryPersonal: {
    color: '#33CFFF', // Color for personal tasks
  },
  categoryStudy: {
    color: '#FF33A8', // Color for study-related tasks
  },
  priorityHigh: {
    color: '#E74C3C', // Color for high priority tasks
  },
  priorityMedium: {
    color: '#F1C40F', // Color for medium priority tasks
  },
  priorityLow: {
    color: '#2ECC71', // Color for low priority tasks
  },
});

export default TaskTrackerScreen;
