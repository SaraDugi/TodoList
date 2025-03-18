import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './pages/LoginScreen';
import TaskListScreen from './pages/TaskListScreen';
import TaskDetailsScreen from './pages/TaskDetailsScreen';
import AddTaskScreen from './pages/AddTaskScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TaskDetails: { task: Task };
  AddTask: undefined;
};

export type Task = {
  id?: string;
  name: string;
  description: string;
  category: string;
  deadline: string;
  reminderDate?: string;
  userId?: string;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    let unsubscribeTasks: () => void = () => {};

    if (user) {
      unsubscribeTasks = firestore()
        .collection('tasks')
        .where('userId', '==', user.uid)
        .onSnapshot(
          (querySnapshot) => {
            if (!querySnapshot) {
              setTasks([]);
              return;
            }

            const userTasks: Task[] = [];
            querySnapshot.forEach((doc) => {
              userTasks.push({
                id: doc.id,
                ...(doc.data() as Task),
              });
            });
            setTasks(userTasks);
          },
          (error) => {
            console.error('Error fetching tasks:', error);
            setTasks([]);
          }
        );
    } else {
      setTasks([]);
    }
    return unsubscribeTasks;
  }, [user]);

  const addTask = async (task: Task) => {
    if (!user) return;
    try {
      await firestore().collection('tasks').add({
        ...task,
        userId: user.uid,
      });
    } catch (error) {
      console.log('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await firestore().collection('tasks').doc(taskId).delete();
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined}>
        {user ? (
          <>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => (
                <TaskListScreen
                  {...props}
                  tasks={tasks}
                  deleteTask={(index: number) => {
                    const taskToDelete = tasks[index];
                    if (taskToDelete?.id) {
                      deleteTask(taskToDelete.id);
                    }
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              options={{ headerShown: true, title: 'Task Details' }}
            />
            <Stack.Screen
              name="AddTask"
              options={{ headerShown: true, title: 'Add Task' }}
            >
              {(props) => <AddTaskScreen {...props} addTask={addTask} />}
            </Stack.Screen>
          </>
        ) : (
          // Unauthenticated route
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});
