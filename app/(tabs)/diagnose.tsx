import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import axios from 'axios';
import { db, auth } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const DiagnoseScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const userID = auth.currentUser?.uid;

  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hi! I’m here to help you. What symptoms are you experiencing?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'HealthBot',
        },
      },
    ]);
  }, []);

  // Function to handle user messages
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    const userMessage = newMessages[0]?.text;
    if (!userID) return Alert.alert('User not authenticated');
    if (userMessage) {
      handleUserMessage(userMessage, userID, [...messages, ...newMessages]); // Pass the latest messages
    }
  }, [messages, userID]);

  // Function to fetch user health profile from Firestore
  const fetchUserProfile = async (userID: string) => {
    try {
      const docRef = doc(db, 'healthProfiles', userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return {};
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {};
    }
  };

  const handleUserMessage = async (userMessage: string, userID: string, currentMessages: IMessage[]) => {
    try {
      // Fetch user profile from Firestore
      const userProfile = await fetchUserProfile(userID);
  
      // Construct the prompt with the latest messages context, including tags for bot and user
      const fullPrompt = `
        User Profile:
        - Age: ${userProfile.age || 'Unknown'}
        - Last Period: ${userProfile.last_period || 'Unknown'}
        - Menopause Status: ${userProfile.menopause_status || 'Unknown'}
        - Pregnancy Status: ${userProfile.pregnancy_status || 'Unknown'}
        - Contraception: ${userProfile.contraception || 'None'}
        - Medical History: ${userProfile.medical_history || 'None'}
        - Medications: ${userProfile.medications || 'None'}
        - Last Pap Smear: ${userProfile.last_pap_smear || 'Unknown'}
        - Last Mammogram: ${userProfile.last_mammogram || 'Unknown'}

        Conversation History:
        ${currentMessages.map((msg) =>
          msg.user._id === 1
            ? `User: ${msg.text}`
            : `Bot: ${msg.text}`
        ).join(' | ')}

        Current User Query: User: ${userMessage}

        You are a specialized AI health assistant acting as a professional doctor in women’s health, with a focus on rural healthcare. Your aim is to provide practical, medically sound advice or guidance based on limited access to healthcare, responding directly to the user’s health needs. Use the following approach:
        - **Engage the user with specific, relevant follow-up questions** to understand the full scope of their issue before providing guidance, if necessary. Tailor these questions based on the profile and query context.
        - **Offer actionable guidance** based on the user’s responses, focusing on home remedies, preventive practices, and basic over-the-counter medications suitable for rural contexts.
        - **Provide a thoughtful response** after gathering adequate context. When sufficient information is gathered, deliver medically relevant insights or probable diagnoses.
        - **Alert to urgent care** only if symptoms suggest a severe or life-threatening condition, with gentle but clear explanations.

      ### Example Interaction Format:

      - **User:** I have a headache and feel very tired.
      - **Bot:** Thank you for sharing. Could you tell me when the headache started and if you've had similar symptoms recently? (Follow-up question)

      - **User:** It started yesterday, and I feel a bit nauseous.
      - **Bot:** Thanks for the details. Sometimes, a headache with nausea can indicate dehydration or stress. Have you had enough water, or have you been under unusual stress? (Specific follow-up for more context)

      - **User:** I haven’t been drinking much water.
      - **Bot:** It sounds like dehydration might be contributing. Try to drink water gradually throughout the day and rest in a cool place. If you feel worse or develop a fever, seek medical attention. (Provide guidance)

      **Note:** Always maintain a respectful, clear, and supportive tone. Limit questions to what’s needed, and ensure responses are actionable and focused on rural healthcare. 

      Now respond to the user query based on the information above.
      `;



  
      // Send the prompt to the Flask API
      const response = await axios.post('http://192.168.29.225:8080/chat', { prompt: fullPrompt });
  
      // Extract response from Flask API
      const botMessage = response.data.message;
  
      // Append the bot's response to the chat
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, [
          {
            _id: Math.random().toString(),
            text: botMessage,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'HealthBot',
            },
          },
        ])
      );
    } catch (error) {
      console.error("Error in sending message to the Flask API:", error);
    }
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
