import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
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
    } catch (error: any) {
      Alert.alert("Prijava ni uspela", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Prijava</Text>
        
        <TextInput
          style={styles.input}
          placeholder="E-pošta"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Geslo"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={signInWithEmail}>
            <Text style={styles.buttonText}>Prijava</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E90FF', // Modro ozadje
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});