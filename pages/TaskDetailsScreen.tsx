import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

type Props = {
  route: TaskDetailsScreenRouteProp;
};

const TaskDetailsScreen: React.FC<Props> = ({ route }) => {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ime opravila:</Text>
      <Text style={styles.value}>{task.name}</Text>

      <Text style={styles.label}>Opis:</Text>
      <Text style={styles.value}>{task.description}</Text>

      <Text style={styles.label}>Kategorija:</Text>
      <Text style={styles.value}>{task.category}</Text>

      <Text style={styles.label}>Rok opravila:</Text>
      <Text style={styles.value}>{task.deadline}</Text>

      <Text style={styles.label}>Datum opomnika:</Text>
      <Text style={styles.value}>{task.reminderDate}</Text>
    </View>
  );
};

export default TaskDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
});