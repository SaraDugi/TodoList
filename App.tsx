import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import TaskListScreen from './pages/TaskListScreen';
import TaskDetailsScreen from './pages/TaskDetailsScreen';
import AddTaskScreen from './pages/AddTaskScreen';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: undefined;
};

export type Task = {
  name: string;
  description: string;
  category: string;
  deadline: string;
  reminderDate?: string;
};

const LoginScreen = ({ navigation }: { navigation: StackNavigationProp<RootStackParamList, 'Login'> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    if (!email || !password) {
      Alert.alert("Napaka", "Prosimo, vnesite e-pošto in geslo.");
      return;
    }

    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      Alert.alert("Prijava ni uspela", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    if (!email || !password) {
      Alert.alert("Napaka", "Prosimo, vnesite e-pošto in geslo.");
      return;
    }

    try {
      setLoading(true);
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert("Registracija uspešna", "Sedaj se lahko prijavite.");
    } catch (error) {
      Alert.alert("Registracija ni uspela", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prijava</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-pošta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Geslo"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Prijava" onPress={signInWithEmail} />
          <Button title="Registracija" onPress={signUpWithEmail} />
        </>
      )}
    </View>
  );
};

const HomeScreen = ({ navigation, tasks, deleteTask }: { navigation: StackNavigationProp<RootStackParamList, 'Home'>; tasks: Task[]; deleteTask: (index: number) => void }) => {
  return (
    <View style={styles.container}>
      <Button title="Odjava" onPress={() => auth().signOut()} />
      <TaskListScreen navigation={navigation as unknown as StackNavigationProp<RootStackParamList, 'TaskList'>} tasks={tasks} deleteTask={deleteTask} />
    </View>
  );
};

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const deleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} tasks={tasks} deleteTask={deleteTask} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        <Stack.Screen name="TaskList">
          {(props) => <TaskListScreen {...props} tasks={tasks} deleteTask={deleteTask} />}
        </Stack.Screen>
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ headerShown: true, title: 'Podrobnosti opravila' }} />
        <Stack.Screen name="AddTask">
          {(props) => <AddTaskScreen {...props} addTask={addTask} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginTop: 10,
    borderRadius: 4,
  },
});