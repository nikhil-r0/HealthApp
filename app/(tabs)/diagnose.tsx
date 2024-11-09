
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

const DiagnoseScreen: React.FC = () => {
  // Define the state to hold messages in the chat
  const [messages, setMessages] = useState<IMessage[]>([]);

  // Load initial message when the screen loads
  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hi! I’m here to help you. What symptoms are you experiencing?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'HealthBot',
          avatar: 'https://placeimg.com/140/140/any', // sample avatar
        },
      },
    ]);
  }, []);

  // Function to handle user messages
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    const userMessage = newMessages[0]?.text?.toLowerCase();
    handleBotResponse(userMessage);
  }, []);

  // Simple function to simulate bot responses based on user input
  const handleBotResponse = (userMessage: string | undefined) => {
    let botResponse = "I'm sorry, I didn't understand that. Can you try rephrasing?";

    if (userMessage?.includes('headache')) {
      botResponse = 'It seems like you have a headache. Try drinking some water and resting. Would you like to know about common headache remedies?';
    } else if (userMessage?.includes('fever')) {
      botResponse = 'If you have a fever, make sure to rest and stay hydrated. Would you like some tips on managing a fever?';
    }

    // Simulate bot response with a small delay
    setTimeout(() => {
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [
        {
          _id: Math.random().toString(),
          text: botResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'HealthBot',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ]));
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        placeholder="Type your symptoms here..."
      />
    </View>
  );
};

export default DiagnoseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
