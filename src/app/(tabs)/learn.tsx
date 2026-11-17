import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LearnItem {
  id: string;
  title: string;
  type: 'article' | 'video';
  category: string;
  readTime?: string;
  content: string;
  url?: string;
}

export default function LearnScreen() {
  const [selectedItem, setSelectedItem] = useState<LearnItem | null>(null);

  const learningItems: LearnItem[] = [
    { 
      id: '1', 
      title: 'Understanding Cravings and How to Manage Them Effectively', 
      type: 'article', 
      category: 'Rehab Guide', 
      readTime: '5 min read',
      content: 'Cravings are temporary waves. When a strong urge hits, practice the 4 Ds: Delay, Deep breathe, Drink water, and Distract yourself with a positive habit.' 
    },
    { 
      id: '2', 
      title: 'Guided Mindfulness Meditation for Recovery (Video)', 
      type: 'video', 
      category: 'Mental Health', 
      url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
      content: 'Watch this guided session to calm your nervous system, reduce stress, and strengthen your discipline.' 
    },
    { 
      id: '3', 
      title: 'Building Unbreakable Daily Habits and Routine Discipline', 
      type: 'article', 
      category: 'Habit Building', 
      readTime: '7 min read',
      content: 'Consistency beats intensity. Focus on small daily actions rather than massive changes to rewire your brain successfully.' 
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Learning & Recovery Hub</Text>
      <Text style={styles.headerSub}>Explore professional articles and video guides.</Text>

      <FlatList<LearnItem>
        data={learningItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => setSelectedItem(item)}>
            <View style={[styles.iconBox, item.type === 'video' && { backgroundColor: '#FFEEEE' }]}>
              <Ionicons 
                name={item.type === 'video' ? 'play-outline' : 'book-outline'} 
                size={22} 
                color={item.type === 'video' ? '#D9534F' : '#174C3C'} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardCategory}>{item.category} {item.readTime ? `• ${item.readTime}` : '• Video'}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#89958D" />
          </Pressable>
        )}
      />

      {/* Reader / Video Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalCategory}>{selectedItem?.category}</Text>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
            <Text style={styles.modalBody}>{selectedItem?.content}</Text>

            {selectedItem?.type === 'video' && selectedItem.url && (
              <Pressable style={styles.videoLinkBtn} onPress={() => Linking.openURL(selectedItem.url!)}>
                <Ionicons name="logo-youtube" size={20} color="#FFFFFF" />
                <Text style={styles.videoLinkText}>Watch Video on YouTube</Text>
              </Pressable>
            )}

            <Pressable style={styles.closeBtn} onPress={() => setSelectedItem(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#174C3C' },
  headerSub: { fontSize: 13, color: '#666', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 1, gap: 12 },
  iconBox: { backgroundColor: '#E2ECE9', padding: 10, borderRadius: 8 },
  cardCategory: { fontSize: 11, color: '#666', fontWeight: '600', marginBottom: 2 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 14, width: '85%' },
  modalCategory: { fontSize: 12, color: '#174C3C', fontWeight: 'bold', marginBottom: 4 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  modalBody: { fontSize: 14, color: '#444', lineHeight: 22, marginBottom: 20 },
  videoLinkBtn: { backgroundColor: '#FF0000', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 8, marginBottom: 12 },
  videoLinkText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  closeBtn: { backgroundColor: '#174C3C', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  closeBtnText: { color: '#FFFFFF', fontWeight: 'bold' }
});