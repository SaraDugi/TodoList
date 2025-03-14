// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebaseConfig';
import TaskListScreen from './pages/TaskListScreen';
import TaskDetailsScreen from './pages/TaskDetailsScreen';
import AddTaskScreen from './pages/AddTaskScreen';
import LoginScreen from './pages/LoginScreen';

// Define a Task type for your to-do items
export type Task = {
  name: string;
  description: string;
  category: string;
  deadline: string;
  reminderDate: string;
};

// Define the routes
export type RootStackParamList = {
  Login: undefined;
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Listen for auth state changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Add a new task to local state
  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Delete a task from local state
  const deleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {user ? (
          // If user is logged in, show the Task screens
          <>
            <Stack.Screen name="TaskList">
              {(props) => (
                <TaskListScreen
                  {...props}
                  tasks={tasks}
                  deleteTask={deleteTask}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              options={{ headerShown: true, title: 'Podrobnosti opravila' }}
            />
            <Stack.Screen name="AddTask">
              {(props) => <AddTaskScreen {...props} addTask={addTask} />}
            </Stack.Screen>
          </>
        ) : (
          // If user is not logged in, show the Login screen
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;