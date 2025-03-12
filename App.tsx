import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TaskListScreen from './pages/TaskListScreen';
import TaskDetailsScreen from './pages/TaskDetailsScreen';
import AddTaskScreen from './pages/AddTaskScreen';

export type Task = {
  name: string;
  description: string;
  category: string;
  deadline: string;
  reminderDate: string;
};

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  return (
    <NavigationContainer>
    <Stack.Navigator id={undefined} initialRouteName="TaskList">
      <Stack.Screen name="TaskList">
        {(props) => <TaskListScreen {...props} tasks={tasks} />}
      </Stack.Screen>
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Podrobnosti opravila' }}
      />
      <Stack.Screen name="AddTask">
        {(props) => <AddTaskScreen {...props} addTask={addTask} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;