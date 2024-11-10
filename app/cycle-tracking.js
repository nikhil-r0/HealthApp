import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CalendarView from '@/components/calendar/CalendarView';
import CycleEntryForm from '@/components/calendar/CycleEntryForm';
import { db, auth } from '@/firebaseConfig';
import { collection, addDoc, getDocs, doc, setDoc, Timestamp, deleteDoc } from 'firebase/firestore';

const CycleTrackingFeature = () => {
  const [showForm, setShowForm] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [cycleEntries, setCycleEntries] = useState([]);
  let userId = auth.currentUser?.uid;

  // Function to initialize user's cycle tracker in the 'users' collection
  const initializeCycleTracker = async () => {
    userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("userId is not defined");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);

      // Check if the user's cycle tracker document exists
      const docSnapshot = await getDocs(collection(userDocRef, "CycleTracker"));

      if (docSnapshot.empty) {
        // Create a user document if it doesn't exist
        await setDoc(userDocRef, {
          createdAt: Timestamp.now(),
        });
        console.log("Cycle Tracker initialized for user:", userId);
      }
    } catch (error) {
      console.error("Error initializing cycle tracker:", error);
    }
  };

  const fetchCycleData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users", userId, "CycleTracker"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,  // Add the document ID to the cycle entry data
        ...doc.data(),
      }));
      const dates = {};
      data.forEach((entry) => {
        const date = entry.date;
        dates[date] = { marked: true, dotColor: '#FF69B4' };
      });
      setCycleEntries(data); // Save all cycle entries with IDs
      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching cycle data: ", error);
    }
  };
  

  useEffect(() => {
    if (userId) {
      initializeCycleTracker();
      fetchCycleData();
    }
  }, [userId]);

  const saveEntry = async (entryData) => {
    try {
      const cycleEntry = { ...entryData, timestamp: Timestamp.now() };

      await addDoc(collection(db, "users", userId, "CycleTracker"), cycleEntry);

      setMarkedDates((prev) => ({
        ...prev,
        [cycleEntry.date]: { marked: true, dotColor: '#FF69B4' },
      }));
      setShowForm(false);
      fetchCycleData(); // Refresh cycle entries list after saving
    } catch (error) {
      console.error("Error saving entry: ", error);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      const entryRef = doc(db, "users", userId, "CycleTracker", entryId);
      await deleteDoc(entryRef);
      setCycleEntries((prevEntries) => prevEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error("Error deleting entry: ", error);
    }
  };
  
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowForm(true);
  };

  const handleEdit = (entry) => {
    setSelectedDate(entry.date);
    setShowForm(true);
  };

  return (
    <View style={styles.container}>
      <CalendarView markedDates={markedDates} onDayPress={handleDayPress} />
      {showForm && selectedDate && (
        <CycleEntryForm
          date={selectedDate}
          onSave={saveEntry}
          onCancel={() => setShowForm(false)}
        />
      )}
      <Button title="Add New Cycle Entry" onPress={() => setShowForm(true)} />

      <View style={styles.entriesContainer}>
        <Text style={styles.entriesTitle}>Cycle Entries</Text>
        {cycleEntries.length === 0 ? (
          <Text style={styles.bodyText}>No cycle entries available.</Text>
        ) : (
          <FlatList
            data={cycleEntries}
            keyExtractor={(item) => item.id}  // Ensure 'id' is being used as the key
            renderItem={({ item }) => (
              <View style={styles.entryItem}>
                <Text style={styles.entryDate}>{item.date}</Text>
                <Text style={styles.entryNotes}>{item.notes}</Text>
                <View style={styles.entryActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteEntry(item.id)}  // Ensure you pass the correct 'id' to delete
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  entriesContainer: {
    marginTop: 20,
  },
  entriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  entryItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  entryDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  entryNotes: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 16,
    color: '#555',
  },
});

export default CycleTrackingFeature;
