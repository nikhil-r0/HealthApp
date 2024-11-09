import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const HealthProfileScreen: React.FC = () => {
  const [age, setAge] = useState('');
  const [lastPeriod, setLastPeriod] = useState('');
  const [menopauseStatus, setMenopauseStatus] = useState('');
  const [pregnancyStatus, setPregnancyStatus] = useState('');
  const [contraception, setContraception] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [medications, setMedications] = useState('');
  const [lastPapSmear, setLastPapSmear] = useState('');
  const [lastMammogram, setLastMammogram] = useState('');
  const userId = firebase.auth().currentUser?.uid;

  const handleSubmit = async () => {
    if (!userId) return Alert.alert('User not authenticated');
  
    try {
      // Get a reference to the document with userId as the ID
      const healthProfileRef = firebase.firestore().collection('healthProfiles').doc(userId);

      // Set data with the timestamp field
      await healthProfileRef.set({
        age,
        lastPeriod,
        menopauseStatus,
        pregnancyStatus,
        contraception,
        medicalHistory,
        medications,
        lastPapSmear,
        lastMammogram,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });  // Merge the data, so it updates existing profile instead of overwriting

      Alert.alert('Profile information updated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Error saving profile information', errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Health Profile</Text>

      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Enter your age"
      />

      <Text style={styles.label}>Last Period (days ago):</Text>
      <TextInput
        style={styles.input}
        value={lastPeriod}
        onChangeText={setLastPeriod}
        keyboardType="numeric"
        placeholder="Enter days since last period"
      />

      <Text style={styles.label}>Menopause Status:</Text>
      <Picker
        selectedValue={menopauseStatus}
        onValueChange={(value) => setMenopauseStatus(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select status" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      <Text style={styles.label}>Pregnancy Status:</Text>
      <Picker
        selectedValue={pregnancyStatus}
        onValueChange={(value) => setPregnancyStatus(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select status" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      <Text style={styles.label}>Contraception Use:</Text>
      <Picker
        selectedValue={contraception}
        onValueChange={(value) => setContraception(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select option" value="" />
        <Picker.Item label="Yes" value="yes" />
        <Picker.Item label="No" value="no" />
      </Picker>

      <Text style={styles.label}>Medical History:</Text>
      <TextInput
        style={styles.input}
        value={medicalHistory}
        onChangeText={setMedicalHistory}
        placeholder="Enter any medical history"
      />

      <Text style={styles.label}>Medications:</Text>
      <TextInput
        style={styles.input}
        value={medications}
        onChangeText={setMedications}
        placeholder="Enter any medications"
      />

      <Text style={styles.label}>Last Pap Smear:</Text>
      <TextInput
        style={styles.input}
        value={lastPapSmear}
        onChangeText={setLastPapSmear}
        placeholder="Enter date of last pap smear"
      />

      <Text style={styles.label}>Last Mammogram:</Text>
      <TextInput
        style={styles.input}
        value={lastMammogram}
        onChangeText={setLastMammogram}
        placeholder="Enter date of last mammogram"
      />

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default HealthProfileScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginVertical: 10 },
  input: { height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: 'white', marginBottom: 10 },
  picker: { height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 20 },
});
