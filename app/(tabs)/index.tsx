import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { db } from '@/firebaseConfig'; // Ensure db is correctly imported
import { collection, getDocs } from 'firebase/firestore';

interface Blog {
  title: string;
  body: string;
  youtubeLink?: string;
}

// Function to render blog content dynamically
const renderContent = (content: string) => {
  const pointsSection = content.split('//START OF POINTS//')[1]?.split('//END OF POINTS//')[0];
  const paragraphsBeforePoints = content.split('//START OF POINTS//')[0];
  const paragraphsAfterPoints = content.split('//END OF POINTS//')[1];

  const points = pointsSection ? pointsSection.split('//END OF POINT//').map((point, index) => point && (
    <View key={index} style={styles.pointContainer}>
      <Text style={styles.pointText}>- {point.trim()}</Text>
    </View>
  )) : null;

  const paragraphsBefore = paragraphsBeforePoints.split('//END OF PARA//').map((para, index) => (
    <Text key={index} style={styles.bodyText}>{para}</Text>
  ));

  const paragraphsAfter = paragraphsAfterPoints.split('//END OF PARA//').map((para, index) => (
    <Text key={index} style={styles.bodyText}>{para}</Text>
  ));

  return (
    <>
      {paragraphsBefore}
      {points}
      {paragraphsAfter}
    </>
  );
};

const HomePage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Function to fetch blogs from Firestore
  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const blogList: Blog[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        blogList.push({
          title: data.title,
          body: data.body,
          youtubeLink: data.youtubeLink,
        });
      });
      setBlogs(blogList);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.introduction}>
        <Text style={styles.title}>Welcome to the Health Tracking App</Text>
        <Text style={styles.subtitle}>
          Keep track of your health and wellness with our app's cycle tracking and health profile features.
        </Text>
        <Text style={styles.bodyText}>
          Maintaining an up-to-date health profile and tracking your cycle regularly can help with accurate diagnoses and
          better health management. Record your symptoms, notes, and track your menstrual cycle to receive personalized
          insights and recommendations.
        </Text>
        <Text style={styles.bodyText}>
          Explore our blogs for helpful tips on health and wellness, and stay informed on how to take better care of
          yourself.
        </Text>
      </View>

      {/* Blog List */}
      <View style={styles.blogSection}>
        <Text style={styles.blogSectionTitle}>Latest Health Blogs</Text>
        {blogs.length === 0 ? (
          <Text style={styles.bodyText}>No blogs available at the moment. Please check back later.</Text>
        ) : (
          blogs.map((blog, index) => (
            <View key={index} style={styles.blogContainer}>
              <Text style={styles.blogTitle}>{blog.title}</Text>
              <View style={styles.blogBody}>{renderContent(blog.body)}</View>
              {blog.youtubeLink && (
                <TouchableOpacity onPress={() => Linking.openURL(blog.youtubeLink || '')}>
                  <Text style={styles.linkText}>Watch the video</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Light gray background for the whole page
    padding: 16,
  },
  introduction: {
    marginBottom: 20,
    backgroundColor: '#fff', // White background for the introduction section
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 28,
    fontWeight: '700', // Bold and professional font weight
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22, // For better readability
    color: '#555',
  },
  blogSection: {
    marginTop: 20,
  },
  blogSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  blogContainer: {
    marginBottom: 20,
    backgroundColor: '#fff', // White background for individual blogs
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light border for separation
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2, // For Android shadow
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  blogBody: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    lineHeight: 22, // For better readability
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  pointContainer: {
    marginLeft: 15,
    marginBottom: 5,
  },
  pointText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
});

export default HomePage;
