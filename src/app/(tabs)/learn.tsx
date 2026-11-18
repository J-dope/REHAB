import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../_layout';

interface LearnItem {
  id: string;
  title: string;
  category: 'article' | 'video' | 'motivation';
  subCategory: string;
  content: string;
  url?: string;
}

export default function LearnScreen() {
  const { isDarkMode } = useAppTheme();
  const [activeTab, setActiveTab] = useState<'article' | 'video' | 'motivation'>('article');
  const [selectedItem, setSelectedItem] = useState<LearnItem | null>(null);

  const learningItems: LearnItem[] = [
    // Articles
    { 
      id: '1', 
      title: 'Understanding Cravings and How to Manage Them Effectively', 
      category: 'article',
      subCategory: 'Rehab Guide • 5 min read',
      content: 'Cravings are temporary waves. When a strong urge hits, practice the 4 Ds: Delay, Deep breathe, Drink water, and Distract yourself.' 
    },
    { 
      id: '2', 
      title: 'Building Unbreakable Daily Habits and Routine Discipline', 
      category: 'article',
      subCategory: 'Habit Building • 7 min read',
      content: 'Consistency beats intensity. Focus on small daily actions rather than massive changes to rewire your brain successfully.' 
    },
    // Videos
    { 
      id: '3', 
      title: 'Guided Mindfulness Meditation for Recovery', 
      category: 'video',
      subCategory: 'Mental Health • Video',
      url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
      content: 'Watch this guided session to calm your nervous system, reduce stress, and strengthen your discipline.' 
    },
    { 
      id: '4', 
      title: 'Overcoming Bad Habits and Retraining Your Brain', 
      category: 'video',
      subCategory: 'Psychology • Video',
      url: 'https://www.youtube.com/watch?v=WsknneeuyQI',
      content: 'A powerful video explaining the science behind neural pathways and how to break free from unwanted habits.' 
    },
    // Motivation
    { 
      id: '5', 
      title: 'One Day at a Time: Your Strength is Greater Than Your Urges', 
      category: 'motivation',
      subCategory: 'Daily Inspiration',
      content: '"You don’t have to see the whole staircase, just take the first step." Every single clean hour is a massive victory.' 
    },
    { 
      id: '6', 
      title: 'The Pain of Discipline vs. The Pain of Regret', 
      category: 'motivation',
      subCategory: 'Mindset Shift',
      content: '"Discipline weighs ounces, while regret weighs tons." Choose the temporary discomfort of growth over staying the same.' 
    },
  ];

  const filteredItems = learningItems.filter(item => item.category === activeTab);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}>
      <Text style={[styles.headerTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Learning & Motivation Hub</Text>
      <Text style={styles.headerSub}>.</Text>

      {/* 3 Tabs (Articles, Videos, Motivation) */}
      <View style={styles.tabRow}>
        <Pressable 
          style={[styles.tabBtn, isDarkMode ? styles.darkSubCard : styles.lightTab, activeTab === 'article' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('article')}
        >
          <Ionicons name="book-outline" size={16} color={activeTab === 'article' ? '#FFFFFF' : (isDarkMode ? '#A7F3D0' : '#174C3C')} />
          <Text style={[styles.tabText, activeTab === 'article' && styles.activeTabText, isDarkMode && activeTab !== 'article' && { color: '#A7F3D0' }]}>Articles</Text>
        </Pressable>

        <Pressable 
          style={[styles.tabBtn, isDarkMode ? styles.darkSubCard : styles.lightTab, activeTab === 'video' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('video')}
        >
          <Ionicons name="play-outline" size={16} color={activeTab === 'video' ? '#FFFFFF' : (isDarkMode ? '#A7F3D0' : '#174C3C')} />
          <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText, isDarkMode && activeTab !== 'video' && { color: '#A7F3D0' }]}>Videos</Text>
        </Pressable>

        <Pressable 
          style={[styles.tabBtn, isDarkMode ? styles.darkSubCard : styles.lightTab, activeTab === 'motivation' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('motivation')}
        >
          <Ionicons name="flame-outline" size={16} color={activeTab === 'motivation' ? '#FFFFFF' : (isDarkMode ? '#A7F3D0' : '#174C3C')} />
          <Text style={[styles.tabText, activeTab === 'motivation' && styles.activeTabText, isDarkMode && activeTab !== 'motivation' && { color: '#A7F3D0' }]}>Motivation</Text>
        </Pressable>
      </View>

      {/* Items List */}
      <FlatList<LearnItem>
        data={filteredItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]} onPress={() => setSelectedItem(item)}>
            <View style={styles.iconBox}>
              <Ionicons 
                name={
                  item.category === 'video' ? 'play-outline' : 
                  item.category === 'motivation' ? 'flame-outline' : 'book-outline'
                } 
                size={22} 
                color="#059669" 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardCategory}>{item.subCategory}</Text>
              <Text style={[styles.cardTitle, isDarkMode ? styles.textWhite : styles.textDark]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#89958D" />
          </Pressable>
        )}
      />

      {/* Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={styles.modalCategory}>{selectedItem?.subCategory}</Text>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>{selectedItem?.title}</Text>
            <Text style={[styles.modalBody, isDarkMode ? { color: '#94A3B8' } : { color: '#444' }]}>{selectedItem?.content}</Text>

            {selectedItem?.category === 'video' && selectedItem.url && (
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
  container: { flex: 1, padding: 16, paddingTop: 50 },
  darkBg: { backgroundColor: '#0F172A' },
  lightBg: { backgroundColor: '#F8FAFC' },

  darkCard: { backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1 },
  lightCard: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 },
  darkSubCard: { backgroundColor: '#1E293B' },
  lightTab: { backgroundColor: '#E2ECE9' },

  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerSub: { fontSize: 13, color: '#64748B', marginBottom: 16 },

  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  activeTabBtn: { backgroundColor: '#059669' },
  tabText: { fontSize: 12, fontWeight: 'bold', color: '#174C3C' },
  activeTabText: { color: '#FFFFFF' },

  card: { padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 1, gap: 12 },
  iconBox: { backgroundColor: 'rgba(5, 150, 105, 0.15)', padding: 10, borderRadius: 8 },
  cardCategory: { fontSize: 11, color: '#059669', fontWeight: '600', marginBottom: 2 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { padding: 22, borderRadius: 14, width: '85%' },
  modalCategory: { fontSize: 12, color: '#059669', fontWeight: 'bold', marginBottom: 4 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalBody: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
  videoLinkBtn: { backgroundColor: '#FF0000', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 8, marginBottom: 12 },
  videoLinkText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  closeBtn: { backgroundColor: '#059669', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  closeBtnText: { color: '#FFFFFF', fontWeight: 'bold' },

  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#1E293B' }
});