import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TaskListScreen from './pages/TaskListScreen';
import TaskDetailsScreen from './pages/TaskDetailsScreen';
import AddTaskScreen from './pages/AddTaskScreen';

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
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

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
      <Stack.Navigator id = {undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TaskList">
          {(props) => <TaskListScreen {...props} tasks={tasks} deleteTask={deleteTask} />}
        </Stack.Screen>
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{ headerShown: true, title: 'Podrobnosti opravila' }}
        />
        <Stack.Screen name="AddTask">
          {(props) => <AddTaskScreen {...props} addTask={addTask} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;