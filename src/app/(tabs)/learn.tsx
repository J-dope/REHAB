import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LearnScreen() {
  const [q1, setQ1] = useState<boolean | null>(null);
  const [q2, setQ2] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Daily Recovery Questionnaire</Text>
      <Text style={styles.headerSub}>Answer daily to evaluate your mindset and triggers.</Text>

      <View style={styles.quizCard}>
        <Text style={styles.question}>1. Have you successfully resisted all cravings today?</Text>
        <View style={styles.optionsRow}>
          <Pressable style={[styles.optionBtn, q1 === true && styles.selectedOpt]} onPress={() => setQ1(true)}>
            <Text style={[styles.optText, q1 === true && styles.selectedOptText]}>Yes</Text>
          </Pressable>
          <Pressable style={[styles.optionBtn, q1 === false && styles.selectedOpt]} onPress={() => setQ1(false)}>
            <Text style={[styles.optText, q1 === false && styles.selectedOptText]}>No / Struggled</Text>
          </Pressable>
        </View>

        <Text style={styles.question}>2. Did you attend or complete your self-care routine?</Text>
        <View style={styles.optionsRow}>
          <Pressable style={[styles.optionBtn, q2 === true && styles.selectedOpt]} onPress={() => setQ2(true)}>
            <Text style={[styles.optText, q2 === true && styles.selectedOptText]}>Yes</Text>
          </Pressable>
          <Pressable style={[styles.optionBtn, q2 === false && styles.selectedOpt]} onPress={() => setQ2(false)}>
            <Text style={[styles.optText, q2 === false && styles.selectedOptText]}>No</Text>
          </Pressable>
        </View>

        <Text style={styles.question}>3. Any specific triggers noticed today?</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="Write brief notes here..." 
          placeholderTextColor="#89958D"
          multiline 
          value={notes} 
          onChangeText={setNotes} 
        />

        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Daily Log</Text>
        </Pressable>

        {submitted && (
          <Text style={styles.successMsg}>✓ Daily Questionnaire successfully recorded!</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#174C3C' },
  headerSub: { fontSize: 13, color: '#666', marginBottom: 16 },
  quizCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 14, elevation: 1, marginBottom: 40 },
  question: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  optionsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  optionBtn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: '#E2ECE9', borderRadius: 8, alignItems: 'center' },
  selectedOpt: { backgroundColor: '#174C3C', borderColor: '#174C3C' },
  optText: { fontSize: 13, color: '#444', fontWeight: '500' },
  selectedOptText: { color: '#FFFFFF', fontWeight: 'bold' },
  textInput: { borderWidth: 1, borderColor: '#E2ECE9', padding: 10, borderRadius: 8, height: 70, textAlignVertical: 'top', fontSize: 13, marginBottom: 15 },
  submitBtn: { backgroundColor: '#174C3C', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  successMsg: { color: '#4E9F3D', fontWeight: 'bold', textAlign: 'center', marginTop: 12, fontSize: 13 }
});