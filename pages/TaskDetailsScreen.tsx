import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { TasksStackParamList } from '../App';

type TaskDetailsScreenRouteProp = RouteProp<TasksStackParamList, 'TaskDetails'>;

type Props = {
  route: TaskDetailsScreenRouteProp;
};

const TaskDetailsScreen: React.FC<Props> = ({ route }) => {
  const { task } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.name}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.detail}>Kategorija: {task.category}</Text>
      <Text style={styles.detail}>Rok: {task.deadline}</Text>
      {task.reminderDate ? (
        <Text style={styles.detail}>Opomnik: {task.reminderDate}</Text>
      ) : null}
    </View>
  );
};

export default TaskDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
});
