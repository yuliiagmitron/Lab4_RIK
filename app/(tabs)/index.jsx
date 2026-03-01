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
import questions from '../../data/questions';
import { saveResults } from '../../utils/saveResults';

export default function SurveyScreen() {
  const [answers, setAnswers] = useState({});

  const handleTextChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleOption = (id, option) => {
    setAnswers((prev) => {
      const current = prev[id] || [];
      if (current.includes(option)) {
        return { ...prev, [id]: current.filter((o) => o !== option) };
      }
      return { ...prev, [id]: [...current, option] };
    });
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => {
      const val = answers[q.id];
      if (q.type === 'text') return !val || !val.trim();
      return !val || val.length === 0;
    });

    if (unanswered.length > 0) {
      Alert.alert(
        'Увага',
        'Будь ласка, дайте відповідь на всі запитання перед відправкою.'
      );
      return;
    }

    const results = questions.map((q) => ({
      question: q.text,
      type: q.type,
      answer: answers[q.id],
    }));

    saveResults(results);
    Alert.alert('Дякуємо!', 'Ваші відповіді збережено у файл survey_results.txt');
    setAnswers({});
  };

  const renderQuestion = (q) => {
    if (q.type === 'text') {
      return (
        <TextInput
          style={styles.input}
          placeholder="Ваша відповідь..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          value={answers[q.id] || ''}
          onChangeText={(val) => handleTextChange(q.id, val)}
        />
      );
    }

    const selected = answers[q.id] || [];
    const isCheckbox = q.type === 'checkbox';

    return (
      <View>
        {q.options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => toggleOption(q.id, option)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  isCheckbox ? styles.checkbox : styles.radioOuter,
                  isSelected && styles.optionSelected,
                ]}
              >
                {isSelected && (
                  isCheckbox ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <View style={styles.radioInner} />
                  )
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
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
          {(q.type === 'checkbox' || q.type === 'multiselect') && (
            <Text style={styles.hint}>Можна обрати декілька варіантів</Text>
          )}
          {renderQuestion(q)}
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
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 10,
    fontStyle: 'italic',
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
    marginTop: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionSelected: {
    borderColor: '#3498db',
    backgroundColor: '#ebf5fb',
  },
  checkmark: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3498db',
  },
  optionText: {
    fontSize: 14,
    color: '#2d3436',
    flex: 1,
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