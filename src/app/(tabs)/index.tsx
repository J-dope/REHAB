import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface HabitItem {
  id: string;
  title: string;
  dailyTime: string;
  targetDate: string;
  completedToday: boolean;
}

interface RehabItem {
  id: string;
  title: string;
  targetDate: string;
  startDate: string;
  completedToday: boolean;
}

interface PinnedRehab {
  title: string;
  startDate: string;
}

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const baseCleanDays = 45;

  // 1. Pinned Special Counter State
  const [pinnedRehab, setPinnedRehab] = useState<PinnedRehab>({
    title: 'Short-Form Videos Free',
    startDate: '2026-11-15T00:00:00',
  });
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(pinnedRehab.startDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      setTimeElapsed({ days, hours, minutes });
    }, 1000);
    return () => clearInterval(interval);
  }, [pinnedRehab.startDate]);

  const [editPinnedModal, setEditPinnedModal] = useState(false);
  const [tempPinnedTitle, setTempPinnedTitle] = useState(pinnedRehab.title);
  const [pinnedDate, setPinnedDate] = useState(new Date(pinnedRehab.startDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 2. Habits State
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: '1', title: 'Morning Meditation', dailyTime: '15 mins', targetDate: '2026-12-31', completedToday: true },
  ]);
  const [habitModalVisible, setHabitModalVisible] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitTime, setHabitTime] = useState('');
  const [habitTarget, setHabitTarget] = useState('');

  // 3. Rehab Programs State
  const [rehabs, setRehabs] = useState<RehabItem[]>([
    { id: '1', title: 'Substance Recovery Phase 1', targetDate: '2026-12-15', startDate: '2026-11-01', completedToday: true },
  ]);
  const [rehabModalVisible, setRehabModalVisible] = useState(false);
  const [editingRehabId, setEditingRehabId] = useState<string | null>(null);
  const [rehabTitle, setRehabTitle] = useState('');
  const [rehabTarget, setRehabTarget] = useState('');

  // 4. Daily Questionnaire State (Bottom of Home)
  const [avoidedRehab, setAvoidedRehab] = useState<boolean | null>(true);
  const [completedHabitsToday, setCompletedHabitsToday] = useState<boolean | null>(true);
  const [quizSubmitted, setQuizSubmitted] = useState(true);

  const moods = [
    { id: '1', emoji: '😡', label: 'Angry' },
    { id: '2', emoji: '😢', label: 'Sad' },
    { id: '3', emoji: '😐', label: 'Neutral' },
    { id: '4', emoji: '😊', label: 'Happy' },
  ];

  // Global Progress Calculation based on Questionnaire & Items
  const calculateGlobalProgress = () => {
    let totalItems = habits.length + rehabs.length;
    if (totalItems === 0) return 100;
    
    let completedItems = habits.filter(h => h.completedToday).length + rehabs.filter(r => r.completedToday).length;
    let quizBonus = (avoidedRehab ? 50 : 0) + (completedHabitsToday ? 50 : 0);
    
    let itemScore = (completedItems / totalItems) * 50;
    let finalScore = Math.round(itemScore + (quizBonus * 0.5));
    return Math.min(100, Math.max(0, finalScore));
  };

  const globalProgress = calculateGlobalProgress();

  const totalCleanDays = baseCleanDays + timeElapsed.days;

  const toggleHabitToday = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday } : h));
  };

  const toggleRehabToday = (id: string) => {
    setRehabs(rehabs.map(r => r.id === id ? { ...r, completedToday: !r.completedToday } : r));
  };

  const handleSaveHabit = () => {
    if (!habitTitle.trim() || !habitTime.trim() || !habitTarget.trim()) return;
    if (editingHabitId) {
      setHabits(habits.map(h => h.id === editingHabitId ? { ...h, title: habitTitle, dailyTime: habitTime, targetDate: habitTarget } : h));
    } else {
      setHabits([...habits, { id: Date.now().toString(), title: habitTitle, dailyTime: habitTime, targetDate: habitTarget, completedToday: false }]);
    }
    setHabitModalVisible(false);
    setEditingHabitId(null);
    setHabitTitle(''); setHabitTime(''); setHabitTarget('');
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handleSaveRehab = () => {
    if (!rehabTitle.trim() || !rehabTarget.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    if (editingRehabId) {
      setRehabs(rehabs.map(r => r.id === editingRehabId ? { ...r, title: rehabTitle, targetDate: rehabTarget } : r));
    } else {
      setRehabs([...rehabs, { id: Date.now().toString(), title: rehabTitle, targetDate: rehabTarget, startDate: today, completedToday: false }]);
    }
    setRehabModalVisible(false);
    setEditingRehabId(null);
    setRehabTitle(''); setRehabTarget('');
  };

  const handleDeleteRehab = (id: string) => {
    setRehabs(rehabs.filter(r => r.id !== id));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Main Clean Days Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroSub}>REHAB - Recovery Journey</Text>
        <Text style={styles.heroTitle}>{totalCleanDays} Days Clean</Text>
        <Text style={styles.heroDesc}>Overall Progress: {globalProgress}% Completed Today</Text>
        
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${globalProgress}%` }]} />
        </View>
      </View>

      {/* 2. Special Pinned Rehab Live Counter */}
      <View style={styles.pinnedContainer}>
        <View style={styles.pinnedHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="time-outline" size={16} color="#174C3C" />
            <Text style={styles.pinnedTitle}>{pinnedRehab.title}</Text>
          </View>
          <Pressable onPress={() => { setTempPinnedTitle(pinnedRehab.title); setEditPinnedModal(true); }}>
            <Ionicons name="settings-outline" size={16} color="#174C3C" />
          </Pressable>
        </View>

        <Text style={styles.pinnedSub}>I've been free for:</Text>

        <View style={styles.timeBoxRow}>
          <View style={styles.timeBox}>
            <Text style={styles.timeNum}>{timeElapsed.days}</Text>
            <Text style={styles.timeLbl}>days</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNum}>{timeElapsed.hours}</Text>
            <Text style={styles.timeLbl}>hours</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeNum}>{timeElapsed.minutes}</Text>
            <Text style={styles.timeLbl}>mins</Text>
          </View>
        </View>
      </View>

      {/* 3. Mood Tracker */}
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

      {/* 4. Habit Tracker Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Habit Tracker (Did you do it?)</Text>
        <Pressable style={styles.addPlusBtn} onPress={() => { setEditingHabitId(null); setHabitTitle(''); setHabitTime(''); setHabitTarget(''); setHabitModalVisible(true); }}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        {habits.map((h) => (
          <View key={h.id} style={styles.habitCard}>
            <Pressable onPress={() => toggleHabitToday(h.id)} style={[styles.checkBox, h.completedToday && styles.checkedBox]}>
              {h.completedToday && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </Pressable>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.cardTitle, h.completedToday && styles.completedText]}>{h.title}</Text>
              <Text style={styles.cardSub}>Daily: {h.dailyTime} • Target: {h.targetDate}</Text>
            </View>
            <View style={styles.actionRow}>
              <Pressable onPress={() => { setEditingHabitId(h.id); setHabitTitle(h.title); setHabitTime(h.dailyTime); setHabitTarget(h.targetDate); setHabitModalVisible(true); }}>
                <Ionicons name="create-outline" size={18} color="#174C3C" style={{ marginRight: 8 }} />
              </Pressable>
              <Pressable onPress={() => handleDeleteHabit(h.id)}>
                <Ionicons name="trash-outline" size={18} color="#D9534F" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* 5. Rehab Programs Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Rehab Programs (Did you avoid it?)</Text>
        <Pressable style={styles.addPlusBtn} onPress={() => { setEditingRehabId(null); setRehabTitle(''); setRehabTarget(''); setRehabModalVisible(true); }}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        {rehabs.map((r) => (
          <View key={r.id} style={styles.rehabCard}>
            <Pressable onPress={() => toggleRehabToday(r.id)} style={[styles.checkBoxWhite, r.completedToday && styles.checkedBoxWhite]}>
              {r.completedToday && <Ionicons name="checkmark" size={14} color="#174C3C" />}
            </Pressable>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.rehabTitle, r.completedToday && styles.completedTextWhite]}>{r.title}</Text>
              <Text style={styles.rehabSub}>Target Date: {r.targetDate}</Text>
            </View>
            <View style={styles.actionRow}>
              <Pressable onPress={() => { setEditingRehabId(r.id); setRehabTitle(r.title); setRehabTarget(r.targetDate); setRehabModalVisible(true); }}>
                <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              </Pressable>
              <Pressable onPress={() => handleDeleteRehab(r.id)}>
                <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {/* 6. Daily Questionnaire Section at Bottom */}
      <View style={styles.quizCard}>
        <Text style={styles.sectionTitle}>Daily Recovery Questionnaire 📋</Text>
        
        <Text style={styles.quizQuestion}>1. Rehab: Did you successfully avoid bad urges today?</Text>
        <View style={styles.quizRow}>
          <Pressable style={[styles.quizBtn, avoidedRehab === true && styles.quizBtnSelected]} onPress={() => setAvoidedRehab(true)}>
            <Text style={[styles.quizBtnText, avoidedRehab === true && styles.quizBtnTextSelected]}>Yes</Text>
          </Pressable>
          <Pressable style={[styles.quizBtn, avoidedRehab === false && styles.quizBtnSelected]} onPress={() => setAvoidedRehab(false)}>
            <Text style={[styles.quizBtnText, avoidedRehab === false && styles.quizBtnTextSelected]}>No</Text>
          </Pressable>
        </View>

        <Text style={styles.quizQuestion}>2. Habits: Did you complete your daily positive habits?</Text>
        <View style={styles.quizRow}>
          <Pressable style={[styles.quizBtn, completedHabitsToday === true && styles.quizBtnSelected]} onPress={() => setCompletedHabitsToday(true)}>
            <Text style={[styles.quizBtnText, completedHabitsToday === true && styles.quizBtnTextSelected]}>Yes</Text>
          </Pressable>
          <Pressable style={[styles.quizBtn, completedHabitsToday === false && styles.quizBtnSelected]} onPress={() => setCompletedHabitsToday(false)}>
            <Text style={[styles.quizBtnText, completedHabitsToday === false && styles.quizBtnTextSelected]}>No</Text>
          </Pressable>
        </View>

        <Pressable style={styles.submitQuizBtn} onPress={() => setQuizSubmitted(true)}>
          <Text style={styles.submitQuizText}>Update Daily Progress Score ✓</Text>
        </Pressable>
        {quizSubmitted && <Text style={styles.quizSuccess}>Progress updated successfully!</Text>}
      </View>

      {/* Modals */}
      <Modal visible={editPinnedModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configure Pinned Counter</Text>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput style={styles.input} value={tempPinnedTitle} onChangeText={setTempPinnedTitle} />

            <Text style={styles.inputLabel}>Select Start Date (Calendar)</Text>
            <Pressable style={styles.calendarTriggerBtn} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={18} color="#174C3C" />
              <Text style={styles.calendarTriggerText}>{pinnedDate.toISOString().split('T')[0]}</Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={pinnedDate}
                mode="date"
                display="default"
                onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setPinnedDate(d); }}
              />
            )}

            <View style={styles.modalActions}>
              <Pressable style={styles.primaryBtn} onPress={() => { setPinnedRehab({ title: tempPinnedTitle, startDate: pinnedDate.toISOString() }); setEditPinnedModal(false); }}>
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setEditPinnedModal(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={habitModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingHabitId ? 'Edit Habit' : 'Add New Habit'}</Text>
            <TextInput style={styles.input} placeholder="Habit Title" value={habitTitle} onChangeText={setHabitTitle} />
            <TextInput style={styles.input} placeholder="Daily Time (e.g. 15 mins)" value={habitTime} onChangeText={setHabitTime} />
            <TextInput style={styles.input} placeholder="Target Date (YYYY-MM-DD)" value={habitTarget} onChangeText={setHabitTarget} />
            <View style={styles.modalActions}>
              <Pressable style={styles.primaryBtn} onPress={handleSaveHabit}><Text style={styles.btnText}>Save</Text></Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setHabitModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={rehabModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingRehabId ? 'Edit Rehab' : 'Add Rehab Program'}</Text>
            <TextInput style={styles.input} placeholder="Rehab Title" value={rehabTitle} onChangeText={setRehabTitle} />
            <TextInput style={styles.input} placeholder="Target Date (YYYY-MM-DD)" value={rehabTarget} onChangeText={setRehabTarget} />
            <View style={styles.modalActions}>
              <Pressable style={styles.primaryBtn} onPress={handleSaveRehab}><Text style={styles.btnText}>Save</Text></Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setRehabModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={moodModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentSmall}>
            <Text style={styles.modalTitle}>Mood Recorded!</Text>
            <Text style={styles.modalBody}>You selected: <Text style={{fontWeight: 'bold'}}>{selectedMood}</Text>.</Text>
            <Pressable style={styles.primaryBtn} onPress={() => setMoodModalVisible(false)}><Text style={styles.btnText}>OK</Text></Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 40 },
  heroCard: { backgroundColor: '#174C3C', padding: 20, borderRadius: 14, alignItems: 'center', marginBottom: 15 },
  heroSub: { color: '#A3C1AD', fontSize: 13, fontWeight: '600' },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginVertical: 4 },
  heroDesc: { color: '#E2ECE9', fontSize: 12, marginBottom: 12, textAlign: 'center' },
  progressBarBg: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#F4D06F', borderRadius: 4 },

  pinnedContainer: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, marginBottom: 15, elevation: 1 },
  pinnedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  pinnedTitle: { fontSize: 14, fontWeight: 'bold', color: '#174C3C' },
  pinnedSub: { fontSize: 11, color: '#666', marginBottom: 10 },
  timeBoxRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  timeBox: { flex: 1, backgroundColor: '#E2ECE9', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  timeNum: { fontSize: 20, fontWeight: 'bold', color: '#174C3C' },
  timeLbl: { fontSize: 10, color: '#555', fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#174C3C', marginBottom: 10, marginTop: 5 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 },
  addPlusBtn: { backgroundColor: '#174C3C', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },

  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  moodCard: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 14, alignItems: 'center', width: '22%', elevation: 1 },
  selectedMoodCard: { borderWidth: 2, borderColor: '#174C3C', backgroundColor: '#E2ECE9' },
  moodEmoji: { fontSize: 22, marginBottom: 4 },
  moodLabel: { fontSize: 11, color: '#444', fontWeight: '500' },

  listContainer: { gap: 10, marginBottom: 10 },
  habitCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  rehabCard: { backgroundColor: '#174C3C', padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  checkBox: { width: 22, height: 22, borderWidth: 2, borderColor: '#174C3C', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  checkedBox: { backgroundColor: '#174C3C' },
  checkBoxWhite: { width: 22, height: 22, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  checkedBoxWhite: { backgroundColor: '#FFFFFF' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#174C3C' },
  completedText: { textDecorationLine: 'line-through', color: '#888' },
  cardSub: { fontSize: 11, color: '#666', marginTop: 4 },
  rehabTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  completedTextWhite: { textDecorationLine: 'line-through', color: '#A3C1AD' },
  rehabSub: { fontSize: 11, color: '#A3C1AD', marginTop: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },

  quizCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, marginTop: 15, marginBottom: 40, elevation: 1 },
  quizQuestion: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 10 },
  quizRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  quizBtn: { flex: 1, paddingVertical: 8, borderWidth: 1, borderColor: '#E2ECE9', borderRadius: 8, alignItems: 'center' },
  quizBtnSelected: { backgroundColor: '#174C3C', borderColor: '#174C3C' },
  quizBtnText: { fontSize: 12, color: '#444', fontWeight: '600' },
  quizBtnTextSelected: { color: '#FFFFFF' },
  submitQuizBtn: { backgroundColor: '#174C3C', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitQuizText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  quizSuccess: { color: '#4E9F3D', fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginTop: 6 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 14, width: '85%' },
  modalContentSmall: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 14, width: '75%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#174C3C', marginBottom: 15 },
  modalBody: { fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 20 },
  inputLabel: { fontSize: 12, color: '#666', marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E2ECE9', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 14 },
  calendarTriggerBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E2ECE9', padding: 12, borderRadius: 8, marginBottom: 20 },
  calendarTriggerText: { color: '#174C3C', fontWeight: 'bold', fontSize: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 5 },
  primaryBtn: { backgroundColor: '#174C3C', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  cancelText: { color: '#666' }
});