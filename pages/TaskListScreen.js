// screens/TaskListScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';

const TaskListScreen = ({ navigation, tasks }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => navigation.navigate('TaskDetails', { task: item })}
    >
      <Text style={styles.taskTitle}>{item.name}</Text>
      <Text style={styles.taskDeadline}>Rok: {item.deadline}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Ni vnesenih opravil.</Text>}
      />
      <Button title="Dodaj opravilo" onPress={() => navigation.navigate('AddTask')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDeadline: {
    fontSize: 14,
    color: '#555',
  },
});

export default TaskListScreen;