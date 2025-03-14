// pages/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // On success, navigate to TaskList
      navigation.replace('TaskList');
    } catch (error: any) {
      Alert.alert('Napaka pri prijavi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>E-pošta:</Text>
      <TextInput
        style={styles.input}
        placeholder="Vnesite e-pošto"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Geslo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Vnesite geslo"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Prijava" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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