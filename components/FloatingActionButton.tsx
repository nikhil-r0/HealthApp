import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

// Define the props type to accept a style prop
interface FloatingActionButtonProps {
  style?: ViewStyle; // Accepts a style prop of type ViewStyle
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ style }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/cycle-tracking'); // Navigates to the cycle tracking screen
  };

  return (
    <TouchableOpacity style={[styles.fab, style]} onPress={handlePress}>
      <FontAwesome name="calendar" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 1,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default FloatingActionButton;
