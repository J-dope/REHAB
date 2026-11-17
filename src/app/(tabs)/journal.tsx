import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../_layout';

interface JournalItem {
  id: string;
  title: string;
  date: string;
  content: string;
}

export default function JournalScreen() {
  const { isDarkMode } = useAppTheme();

  const [journals, setJournals] = useState<JournalItem[]>([
    {
      id: '1',
      title: 'My Day 1 Reflections',
      date: 'Nov 17, 2026',
      content: 'Today was challenging, but I stayed strong and practiced deep breathing when strong urges hit. Feeling proud of my progress.'
    },
    {
      id: '2',
      title: 'Morning Routine Success',
      date: 'Nov 16, 2026',
      content: 'Completed morning meditation and followed my daily schedule strictly. Consistency is key!'
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalItem | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  };

  const handleSaveJournal = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please enter both title and note content.');
      return;
    }

    if (editingId) {
      setJournals(journals.map(j => j.id === editingId ? { ...j, title, content } : j));
    } else {
      const newEntry: JournalItem = {
        id: Date.now().toString(),
        title,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        content,
      };
      setJournals([newEntry, ...journals]);
    }

    setModalVisible(false);
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const handleDeleteJournal = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this journal note?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          setJournals(journals.filter(j => j.id !== id));
          setSelectedJournal(null);
        } 
      }
    ]);
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerTitle, isDarkMode ? styles.textWhite : styles.textDark]}>My Recovery Journal 📝</Text>
          <Text style={styles.headerSub}></Text>
        </View>
        <Pressable style={styles.addBtn} onPress={handleOpenAddModal}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Journal List */}
      {journals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={48} color="#64748B" />
          <Text style={[styles.emptyText, isDarkMode ? styles.textGray : styles.textDark]}>No journal entries yet. Tap '+' to write your first note!</Text>
        </View>
      ) : (
        journals.map((item) => (
          <Pressable 
            key={item.id} 
            style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}
            onPress={() => setSelectedJournal(item)}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, isDarkMode ? styles.textWhite : styles.textDark]} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <Text style={[styles.cardSnippet, isDarkMode ? styles.textGray : styles.textMuted]} numberOfLines={2}>{item.content}</Text>
          </Pressable>
        ))
      )}

      {/* View / Read Journal Modal (Safely guarded with selectedJournal check) */}
      {selectedJournal && (
        <Modal visible={!!selectedJournal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
              <Text style={styles.modalDate}>{selectedJournal.date}</Text>
              <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>{selectedJournal.title}</Text>
              <Text style={[styles.modalBody, isDarkMode ? styles.textGray : styles.textDark]}>{selectedJournal.content}</Text>

              <View style={styles.modalActionRow}>
                <Pressable 
                  style={styles.editActionBtn} 
                  onPress={() => {
                    const currentId = selectedJournal.id;
                    const currentTitle = selectedJournal.title;
                    const currentContent = selectedJournal.content;
                    setSelectedJournal(null);
                    setEditingId(currentId);
                    setTitle(currentTitle);
                    setContent(currentContent);
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Edit</Text>
                </Pressable>

                <Pressable 
                  style={styles.deleteActionBtn} 
                  onPress={() => handleDeleteJournal(selectedJournal.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Delete</Text>
                </Pressable>
              </View>

              <Pressable style={styles.closeBtn} onPress={() => setSelectedJournal(null)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Add / Edit Journal Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>
              {editingId ? 'Edit Journal Note' : 'New Journal Note'}
            </Text>
            
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput 
              style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} 
              placeholder="Give a title to your note..." 
              placeholderTextColor="#888"
              value={title} 
              onChangeText={setTitle} 
            />

            <Text style={styles.inputLabel}>Content</Text>
            <TextInput 
              style={[styles.textArea, isDarkMode ? styles.darkInput : styles.lightInput]} 
              placeholder="Write your thoughts here..." 
              placeholderTextColor="#888"
              multiline 
              value={content} 
              onChangeText={setContent} 
            />

            <View style={styles.modalActionsRow}>
              <Pressable style={styles.primaryBtn} onPress={handleSaveJournal}>
                <Text style={styles.btnText}>Save Note</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  darkBg: { backgroundColor: '#0F172A' },
  lightBg: { backgroundColor: '#F8FAFC' },

  darkCard: { backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1 },
  lightCard: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  addBtn: { backgroundColor: '#059669', width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', elevation: 2 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },

  card: { padding: 14, borderRadius: 14, marginBottom: 12, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', flex: 1, marginRight: 10 },
  cardDate: { fontSize: 11, color: '#059669', fontWeight: '600' },
  cardSnippet: { fontSize: 12, lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { padding: 22, borderRadius: 16, width: '88%', borderWidth: 1, borderColor: '#334155' },
  modalDate: { fontSize: 11, color: '#059669', fontWeight: 'bold', marginBottom: 2 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalBody: { fontSize: 14, lineHeight: 22, marginBottom: 20 },

  modalActionRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  editActionBtn: { flex: 1, backgroundColor: '#0284C7', paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  deleteActionBtn: { flex: 1, backgroundColor: '#DC2626', paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },

  inputLabel: { fontSize: 11, color: '#64748B', marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
  textArea: { borderWidth: 1, padding: 10, borderRadius: 8, height: 120, textAlignVertical: 'top', marginBottom: 14, fontSize: 13 },
  darkInput: { borderColor: '#475569', backgroundColor: '#0F172A', color: '#FFFFFF' },
  lightInput: { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC', color: '#000000' },

  modalActionsRow: { flexDirection: 'row', gap: 8 },
  primaryBtn: { flex: 1, backgroundColor: '#059669', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: '600', fontSize: 12 },

  closeBtn: { backgroundColor: '#334155', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  closeBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },

  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#1E293B' },
  textGray: { color: '#94A3B8' },
  textMuted: { color: '#64748B' }
});