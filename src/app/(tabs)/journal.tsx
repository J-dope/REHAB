import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

export default function JournalScreen() {
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', date: 'Nov 16, 2026', text: 'Felt a bit stressed today, but went for a long walk and practiced deep breathing.' },
  ]);

  const handleAddEntry = () => {
    if (journalText.trim() === '') return;
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: 'Today',
      text: journalText,
    };
    setEntries([newEntry, ...entries]);
    setJournalText('');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Recovery Journal</Text>
      <Text style={styles.headerSub}>Write down your daily thoughts and feelings safely.</Text>

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="How was your day? Write your thoughts..."
          placeholderTextColor="#89958D"
          multiline
          value={journalText}
          onChangeText={setJournalText}
        />
        <Pressable style={styles.saveBtn} onPress={handleAddEntry}>
          <Text style={styles.saveBtnText}>Save Entry</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Previous Journal Entries</Text>

      {/* Entries List with Delete Button */}
      <FlatList<JournalEntry>
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="journal-outline" size={16} color="#174C3C" />
                <Text style={styles.entryDate}>{item.date}</Text>
              </View>
              <Pressable onPress={() => handleDeleteEntry(item.id)}>
                <Ionicons name="trash-outline" size={18} color="#D9534F" />
              </Pressable>
            </View>
            <Text style={styles.entryText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#174C3C' },
  headerSub: { fontSize: 13, color: '#666', marginBottom: 16 },
  inputContainer: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, marginBottom: 20, elevation: 1 },
  textInput: { height: 80, textAlignVertical: 'top', fontSize: 14, color: '#333', marginBottom: 10 },
  saveBtn: { backgroundColor: '#174C3C', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#174C3C', marginBottom: 10 },
  entryCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  entryDate: { fontSize: 12, fontWeight: 'bold', color: '#174C3C' },
  entryText: { fontSize: 13, color: '#444', lineHeight: 20 }
});