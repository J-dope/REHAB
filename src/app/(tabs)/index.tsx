import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CopingTip {
  id: string;
  title: string;
  category: string;
  duration: string;
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  
  const copingTips: CopingTip[] = [
    { id: '1', title: 'Mindful Deep Breathing', category: 'Mindfulness', duration: '5 mins' },
    { id: '2', title: 'Reach Out to Support Sponsor', category: 'Support', duration: '10 mins' },
    { id: '3', title: 'Grounding Exercise (5-4-3-2-1)', category: 'Mental Health', duration: '8 mins' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroSub}>REHAB - Recovery with Hope</Text>
        <Text style={styles.heroTitle}>45 Days Clean</Text>
        <Text style={styles.heroDesc}>One day at a time. Your journey matters.</Text>
        
        <Pressable 
          style={[styles.checkBtn, checkedIn && styles.checkedDone]}
          onPress={() => !checkedIn && setModalVisible(true)}
        >
          <Text style={styles.checkBtnText}>{checkedIn ? 'Checked In Today ✓' : 'Daily Check-In'}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Emergency Coping Strategies</Text>

      <FlatList<CopingTip>
        data={copingTips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>{item.category} • {item.duration}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#89958D" />
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Daily Check-In</Text>
            <Text style={styles.modalBody}>Are you committing to stay strong and sober today?</Text>
            
            <View style={styles.modalActions}>
              <Pressable 
                style={styles.confirmBtn} 
                onPress={() => {
                  setCheckedIn(true);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.btnText}>I Commit</Text>
              </Pressable>
              
              <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 60 },
  heroCard: { backgroundColor: '#174C3C', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  heroSub: { color: '#A3C1AD', fontSize: 13, fontWeight: '600' },
  heroTitle: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginVertical: 6 },
  heroDesc: { color: '#E2ECE9', fontSize: 13, marginBottom: 15, textAlign: 'center' },
  checkBtn: { backgroundColor: '#F4D06F', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  checkedDone: { backgroundColor: '#4E9F3D' },
  checkBtnText: { color: '#111', fontWeight: 'bold', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#174C3C', marginBottom: 10 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#222' },
  cardSub: { fontSize: 12, color: '#666', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 12, width: '82%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#174C3C', marginBottom: 8 },
  modalBody: { fontSize: 14, color: '#555', marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  confirmBtn: { backgroundColor: '#174C3C', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  cancelText: { color: '#666', fontWeight: '500' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' }
});