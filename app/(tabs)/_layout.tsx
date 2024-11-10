import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import FloatingActionButton from '@/components/FloatingActionButton'; // Adjust path if needed

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="diagnose"
          options={{
            title: 'Diagnose',
            tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="user-doctor" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Health Profile',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="face-woman" size={24} color="black" />,
          }}
        />
      </Tabs>
      
      {/* Floating Action Button above the tab bar */}
      <FloatingActionButton style={styles.fab} />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80, // Adjust based on the height of the tab bar
    right: 20,
    zIndex: 1, // Ensure the FAB is above the tab bar
  },
});
