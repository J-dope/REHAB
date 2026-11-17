import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Appointment {
  id: string;
  time: string;
  doctor: string;
  dateNum: string;
  dateMonth: string;
}

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  
  // Add Rehab Activity Modal state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('');
  
  const [activities, setActivities] = useState([
    { id: '1', title: 'Meditation', duration: '30 mins', icon: 'leaf-outline', color: '#E2ECE9' },
    { id: '2', title: 'Wake up Routine', duration: '15 mins', icon: 'sunny-outline', color: '#F4D06F' },
  ]);

  // Appointments state with Edit & Delete support
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', time: '14:30', doctor: 'Dr. Samantha', dateNum: '28', dateMonth: 'Apr' }
  ]);
  const [apptModalVisible, setApptModalVisible] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [apptTime, setApptTime] = useState('');
  const [apptDoctor, setApptDoctor] = useState('');

  const moods = [
    { id: '1', emoji: '😡', label: 'Angry' },
    { id: '2', emoji: '😢', label: 'Sad' },
    { id: '3', emoji: '😐', label: 'Neutral' },
    { id: '4', emoji: '😊', label: 'Happy' },
  ];

  const handleAddActivity = () => {
    if (!newTitle.trim()) return;
    setActivities([...activities, { id: Date.now().toString(), title: newTitle, duration: newDuration || '10 mins', icon: 'star-outline', color: '#C6E7FF' }]);
    setNewTitle('');
    setNewDuration('');
    setAddModalVisible(false);
  };

  const handleSaveAppt = () => {
    if (editingAppt) {
      setAppointments(appointments.map(a => a.id === editingAppt.id ? { ...a, time: apptTime, doctor: apptDoctor } : a));
    } else {
      setAppointments([...appointments, { id: Date.now().toString(), time: apptTime, doctor: apptDoctor, dateNum: '15', dateMonth: 'May' }]);
    }
    setApptModalVisible(false);
  };

  const handleDeleteAppt = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Progress Quick View */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#174C3C" />
          </View>
          <View>
            <Text style={styles.userName}>Janaka Ekanayake</Text>
            <Text style={styles.userRole}>45 Days Clean (50% Milestone)</Text>
          </View>
        </View>
        {/* + Add Activity Button */}
        <Pressable style={styles.addPlusBtn} onPress={() => setAddModalVisible(true)}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Mood Tracker */}
      <Text style={styles.sectionTitle}>How do you feel today?</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <Pressable 
            key={m.id} 
            style={[styles.moodCard, selectedMood === m.label && styles.selectedMoodCard]}
            onPress={() => { setSelectedMood(m.label); setMoodModalVisible(true); }}
          >
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
            <Text style={styles.moodLabel}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Appointments Section with Edit/Delete */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Appointments & Support</Text>
        <Pressable onPress={() => { setEditingAppt(null); setApptTime(''); setApptDoctor(''); setApptModalVisible(true); }}>
          <Text style={styles.linkText}>+ Add</Text>
        </Pressable>
      </View>

      {appointments.map((appt) => (
        <View key={appt.id} style={styles.appointmentCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.apptHeader}>{appt.doctor}</Text>
            <Text style={styles.apptTime}>{appt.time}</Text>
          </View>
          <View style={styles.apptActions}>
            <Pressable onPress={() => { setEditingAppt(appt); setApptTime(appt.time); setApptDoctor(appt.doctor); setApptModalVisible(true); }}>
              <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
            </Pressable>
            <Pressable onPress={() => handleDeleteAppt(appt.id)}>
              <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
            </Pressable>
          </View>
          <View style={styles.dateBadge}>
            <Text style={styles.dateNum}>{appt.dateNum}</Text>
            <Text style={styles.dateMonth}>{appt.dateMonth}</Text>
          </View>
        </View>
      ))}

      {/* Self-care / Rehab Activities Grid */}
      <Text style={styles.sectionTitle}>Rehab & Self-Care Activities</Text>
      <View style={styles.gridContainer}>
        {activities.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon as any} size={24} color="#174C3C" style={{ marginBottom: 10 }} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDuration}>{item.duration}</Text>
          </View>
        ))}
      </View>

      {/* Add Rehab Activity Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Rehab Activity</Text>
            <TextInput style={styles.input} placeholder="Activity Title (e.g. Yoga)" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Duration (e.g. 20 mins)" value={newDuration} onChangeText={setNewDuration} />
            <View style={styles.modalActions}>
              <Pressable style={styles.primaryBtn} onPress={handleAddActivity}><Text style={styles.btnText}>Add</Text></Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setAddModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Appointment Edit/Add Modal */}
      <Modal visible={apptModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingAppt ? 'Edit Appointment' : 'New Appointment'}</Text>
            <TextInput style={styles.input} placeholder="Doctor / Counselor Name" value={apptDoctor} onChangeText={setApptDoctor} />
            <TextInput style={styles.input} placeholder="Time (e.g. 10:00 AM)" value={apptTime} onChangeText={setApptTime} />
            <View style={styles.modalActions}>
              <Pressable style={styles.primaryBtn} onPress={handleSaveAppt}><Text style={styles.btnText}>Save</Text></Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setApptModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2ECE9', justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#174C3C' },
  userRole: { fontSize: 11, color: '#666' },
  addPlusBtn: { backgroundColor: '#174C3C', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#174C3C', marginBottom: 12, marginTop: 10 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  linkText: { color: '#174C3C', fontWeight: 'bold', fontSize: 13 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  moodCard: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 14, alignItems: 'center', width: '22%', elevation: 1 },
  selectedMoodCard: { borderWidth: 2, borderColor: '#174C3C', backgroundColor: '#E2ECE9' },
  moodEmoji: { fontSize: 24, marginBottom: 4 },
  moodLabel: { fontSize: 11, color: '#444', fontWeight: '500' },
  appointmentCard: { backgroundColor: '#174C3C', padding: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  apptHeader: { color: '#A3C1AD', fontSize: 13, fontWeight: '600' },
  apptTime: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', marginTop: 4 },
  apptActions: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  dateBadge: { backgroundColor: '#FFFFFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center' },
  dateNum: { fontSize: 16, fontWeight: 'bold', color: '#174C3C' },
  dateMonth: { fontSize: 10, color: '#666', fontWeight: '600' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 40 },
  card: { width: '48%', padding: 16, borderRadius: 14, marginBottom: 15, elevation: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#174C3C', marginBottom: 2 },
  cardDuration: { fontSize: 12, color: '#555' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 14, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#174C3C', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#E2ECE9', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  primaryBtn: { backgroundColor: '#174C3C', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  cancelText: { color: '#666' }
});