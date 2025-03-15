import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Modal,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Task } from '../App';

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

type Props = {
  navigation: TaskListScreenNavigationProp;
  tasks: Task[];
  deleteTask: (index: number) => void;
};

const TaskListScreen: React.FC<Props> = ({ navigation, tasks, deleteTask }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);

  // Confirm deletion after swipe
  const handleDeleteConfirm = () => {
    if (selectedTaskIndex !== null) {
      deleteTask(selectedTaskIndex);
    }
    setModalVisible(false);
    setSelectedTaskIndex(null);
  };

  // Render each task in the list
  const renderItem = ({ item, index }: { item: Task; index: number }) => {
    // This is the view that appears when swiping left
    const renderRightActions = () => (
      <View style={styles.deleteAction}>
        <Text style={styles.deleteText}>Izbriši</Text>
      </View>
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableRightOpen={() => {
          setSelectedTaskIndex(index);
          setModalVisible(true);
        }}
      >
        <TouchableOpacity
          style={styles.taskItem}
          onPress={() => navigation.navigate('TaskDetails', { task: item })}
        >
          <Text style={styles.taskTitle}>{item.name}</Text>
          <Text style={styles.taskDeadline}>Rok: {item.deadline}</Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Ni vnesenih opravil.</Text>}
      />

      <Button title="Dodaj opravilo" onPress={() => navigation.navigate('AddTask')} />

      {/* Confirmation modal for deleting a task */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Ali ste prepričani, da želite izbrisati opravilo?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Prekliči" onPress={() => setModalVisible(false)} />
              <Button title="Potrdi" onPress={handleDeleteConfirm} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDeadline: {
    fontSize: 14,
    color: '#555',
  },
  deleteAction: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});