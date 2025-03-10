// screens/AddTaskScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Picker, StyleSheet } from 'react-native';

const AddTaskScreen = ({ navigation, addTask }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Osebno');
  const [deadline, setDeadline] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  const handleAddTask = () => {
    if (!name || !deadline) {
      alert('Prosimo, izpolnite obvezna polja (ime in rok opravila).');
      return;
    }

    const newTask = {
      name,
      description,
      category,
      deadline,
      reminderDate,
    };

    addTask(newTask);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ime opravila:</Text>
      <TextInput
        style={styles.input}
        placeholder="Vnesite ime opravila"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Opis opravila:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Vnesite opis opravila"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Kategorija:</Text>
      <Picker
        selectedValue={category}
        style={styles.input}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Osebno" value="Osebno" />
        <Picker.Item label="Delo" value="Delo" />
        <Picker.Item label="Šola" value="Šola" />
      </Picker>

      <Text style={styles.label}>Rok opravila (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="npr. 2025-04-30"
        value={deadline}
        onChangeText={setDeadline}
      />

      <Text style={styles.label}>Datum opomnika (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="npr. 2025-04-25"
        value={reminderDate}
        onChangeText={setReminderDate}
      />

      <Button title="Dodaj opravilo" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginTop: 5,
    borderRadius: 4,
  },
});

export default AddTaskScreen;