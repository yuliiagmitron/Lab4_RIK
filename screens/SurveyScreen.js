import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import questions from '../data/questions';
import { saveResults } from '../utils/saveResults';

export default function SurveyScreen() {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      Alert.alert(
        'Увага',
        'Будь ласка, дайте відповідь на всі запитання перед відправкою.'
      );
      return;
    }

    const results = questions.map((q) => ({
      question: q.text,
      answer: answers[q.id],
    }));

    saveResults(results);
    Alert.alert('Дякуємо!', 'Ваші відповіді збережено у файл survey_results.json');
    setAnswers({});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Опитування</Text>
      <Text style={styles.subtitle}>Задоволеність сервісом</Text>

      {questions.map((q) => (
        <View key={q.id} style={styles.card}>
          <Text style={styles.label}>
            {q.id}. {q.text}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ваша відповідь..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            value={answers[q.id] || ''}
            onChangeText={(val) => handleChange(q.id, val)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Надіслати</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#2d3436',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
