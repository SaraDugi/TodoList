import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './pages/LoginScreen';
import TaskListScreen from './pages/TaskListScreen';
import TaskDetailsScreen from './pages/TaskDetailsScreen';
import AddTaskScreen from './pages/AddTaskScreen';
import SettingsScreen from './pages/SettingsScreen';

export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
};

export type TasksStackParamList = {
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: undefined;
};

export type TabParamList = {
  TasksTab: undefined;
  SettingsTab: undefined;
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

const TasksStack = createStackNavigator<TasksStackParamList>();
function TasksStackNavigator({
  tasks,
  deleteTask,
  addTask,
}: {
  tasks: Task[];
  deleteTask: (index: number) => void;
  addTask: (task: Task) => void;
}) {
  return (
    <TasksStack.Navigator id={undefined}>
      <TasksStack.Screen
        name="TaskList"
        options={{ headerTitle: 'Opravila' }}
      >
        {(props) => (
          <TaskListScreen
            {...props}
            tasks={tasks}
            deleteTask={deleteTask}
          />
        )}
      </TasksStack.Screen>

      <TasksStack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ headerTitle: 'Podrobnosti opravila' }}
      />

      <TasksStack.Screen
        name="AddTask"
        options={{ headerTitle: 'Dodaj opravilo' }}
      >
        {(props) => <AddTaskScreen {...props} addTask={addTask} />}
      </TasksStack.Screen>
    </TasksStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabParamList>();
function MainTabs({
  tasks,
  deleteTask,
  addTask,
}: {
  tasks: Task[];
  deleteTask: (index: number) => void;
  addTask: (task: Task) => void;
}) {
  return (
    <Tab.Navigator id={undefined}>
      <Tab.Screen name="TasksTab" options={{ title: 'Opravila' }}>
        {() => (
          <TasksStackNavigator
            tasks={tasks}
            deleteTask={deleteTask}
            addTask={addTask}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: 'Nastavitve' }}
      />
    </Tab.Navigator>
  );
}

const AuthStack = createStackNavigator();
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator id={undefined}>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const authStatus = await messaging().requestPermission();
        console.log('Notification permission status:', authStatus);
      } catch (error) {
        console.error('Permission request error:', error);
      }
    })();
  }, []);

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

  const deleteTaskInFirestore = async (taskId: string) => {
    try {
      await firestore().collection('tasks').doc(taskId).delete();
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  };

  const deleteTask = (index: number) => {
    const taskToDelete = tasks[index];
    if (taskToDelete?.id) {
      deleteTaskInFirestore(taskToDelete.id);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainTabs
          tasks={tasks}
          deleteTask={deleteTask}
          addTask={addTask}
        />
      ) : (
        <AuthStackNavigator />
      )}
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