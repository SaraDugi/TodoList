import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import messaging from '@react-native-firebase/messaging';

const storage = new MMKV();
const MOTIVATIONAL_KEY = 'motivationalMessages';

const SettingsScreen: React.FC = () => {
  const [motivationalEnabled, setMotivationalEnabled] = useState<boolean>(false);

  useEffect(() => {
    const savedValue = storage.getString(MOTIVATIONAL_KEY);
    if (savedValue != null) {
      setMotivationalEnabled(JSON.parse(savedValue));
    }
  }, []);

  const toggleMotivational = async (value: boolean) => {
    setMotivationalEnabled(value);
    storage.set(MOTIVATIONAL_KEY, JSON.stringify(value));
    try {
      if (value) {
        await messaging().subscribeToTopic('motivational');
        console.log('Subscribed to motivational topic');
      } else {
        await messaging().unsubscribeFromTopic('motivational');
        console.log('Unsubscribed from motivational topic');
      }
    } catch (error) {
      console.error('Error subscribing/unsubscribing from topic:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nastavitve računa</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Prejemanje motivacijskih sporočil:</Text>
        <Switch value={motivationalEnabled} onValueChange={toggleMotivational} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 16,
  },
});