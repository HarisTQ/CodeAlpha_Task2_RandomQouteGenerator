import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Share, Animated, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const preStoredQuotes = [
  //... (Quotes array remains the same)
];

const Stack = createStackNavigator();

const SplashScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
    ]).start(() => {
      navigation.replace('Home');
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.splashContainer}>
      <StatusBar hidden />
      <Animated.Image
        source={require('./assets/bulb-transformed.jpeg')}
        style={[styles.splashImage, { opacity: fadeAnim }]}
      />
      <Animated.Text style={[styles.splashText, { opacity: fadeAnim }]}>
        Welcome to World of Quote
      </Animated.Text>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    initializeQuotes();
    fetchRandomQuote();
  }, []);

  const initializeQuotes = async () => {
    try {
      const savedQuotes = await AsyncStorage.getItem('quotes');
      if (!savedQuotes) {
        await AsyncStorage.setItem('quotes', JSON.stringify(preStoredQuotes));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRandomQuote = async () => {
    try {
      const savedQuotes = await AsyncStorage.getItem('quotes');
      const quotesArray = savedQuotes ? JSON.parse(savedQuotes) : [];
      if (quotesArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotesArray.length);
        setQuote(quotesArray[randomIndex].quote);
        setAuthor(quotesArray[randomIndex].author);
      } else {
        setQuote('No quotes available. Please add some quotes.');
        setAuthor('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${quote} - ${author}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        <View style={styles.quoteFrame}>
          <Text style={styles.quoteText}>{quote}</Text>
          <Text style={styles.authorText}>{author}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={fetchRandomQuote}>
        <Text style={styles.buttonText}>Get New Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddQuote')}>
        <Text style={styles.buttonText}>Add Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onShare}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const AddQuoteScreen = ({ navigation }) => {
  const [newQuote, setNewQuote] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const saveQuote = async () => {
    if (newQuote && newAuthor) {
      try {
        const savedQuotes = await AsyncStorage.getItem('quotes');
        const quotesArray = savedQuotes ? JSON.parse(savedQuotes) : [];
        quotesArray.push({ quote: newQuote, author: newAuthor });
        await AsyncStorage.setItem('quotes', JSON.stringify(quotesArray));
        setNewQuote('');
        setNewAuthor('');
        alert('Quote saved successfully!');
        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please enter both a quote and an author.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Quote"
        value={newQuote}
        onChangeText={setNewQuote}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Author"
        value={newAuthor}
        onChangeText={setNewAuthor}
      />
      <TouchableOpacity style={styles.button} onPress={saveQuote}>
        <Text style={styles.buttonText}>Save Quote</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Random Quote',
            headerTransparent: true,
            headerTitleStyle: { color: '#fff' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="AddQuote" 
          component={AddQuoteScreen} 
          options={{ 
            title: 'Add Quote',
            headerTransparent: true,
            headerTitleStyle: { color: '#fff' },
            headerTintColor: '#fff',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  splashImage: {
    width: 230,
    height: 230,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#61dafb',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  quoteContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quoteFrame: {
    borderWidth: 2,
    borderColor: '#61dafb',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  quoteText: {
    fontSize: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333',
  },
  authorText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#61dafb',
    padding: 15,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#282c34',
    fontSize: 16,
  },
});

export default App;
