import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useAppTheme } from '../_layout';

// Notification Handler: In-app Pop-up නොපෙන්වා System Notification Bar එකට පමණක් පෙන්වීම
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // Screen එක උඩින් popup වීම වළක්වයි
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // System Notification Bar එකට පමණක් පෙන්වයි
    shouldShowList: true,
  }),
});

interface HabitItem {
  id: string;
  title: string;
  dailyTime: string;
  reminderHour: number;
  reminderMinute: number;
  targetDate: string;
  completedToday: boolean;
  notificationId?: string;
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
  const { isDarkMode } = useAppTheme();

  // --- INITIALIZE DAILY QUESTIONNAIRE NOTIFICATION ---
  useEffect(() => {
    async function setupPermissionsAndDailyQuiz() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      for (const notif of scheduled) {
        if (notif.content.data?.type === 'daily-quiz') {
          await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        }
      }

      // Daily Questionnaire Reminder (Once a day at 8:00 AM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Check-in Reminder 📋',
          body: "Don't forget to complete your daily questionnaire and earn today's marks!",
          data: { type: 'daily-quiz' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 8,
          minute: 0,
        },
      });
    }

    setupPermissionsAndDailyQuiz();
  }, []);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodModalVisible, setMoodModalVisible] = useState(false);

  // Pinned Special Counter State
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

  // Habits State (with Reminder Time)
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: '1',
      title: 'Morning Meditation',
      dailyTime: '07:30 AM',
      reminderHour: 7,
      reminderMinute: 30,
      targetDate: '2026-12-31',
      completedToday: false,
    },
  ]);
  const [habitModalVisible, setHabitModalVisible] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitTarget, setHabitTarget] = useState('');
  const [habitReminderDate, setHabitReminderDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Rehab Programs State
  const [rehabs, setRehabs] = useState<RehabItem[]>([
    { id: '1', title: 'Substance Recovery Phase 1', targetDate: '2026-12-15', startDate: '2026-11-01', completedToday: false },
  ]);
  const [rehabModalVisible, setRehabModalVisible] = useState(false);
  const [editingRehabId, setEditingRehabId] = useState<string | null>(null);
  const [rehabTitle, setRehabTitle] = useState('');
  const [rehabTarget, setRehabTarget] = useState('');

  // Daily Questionnaire & Marks State
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [avoidedRehab, setAvoidedRehab] = useState<boolean | null>(null);
  const [resistedStrongUrges, setResistedStrongUrges] = useState<boolean | null>(null);
  const [completedHabitsToday, setCompletedHabitsToday] = useState<boolean | null>(null);
  const [followedRoutine, setFollowedRoutine] = useState<boolean | null>(null);

  const [lastSubmitDate, setLastSubmitDate] = useState<string | null>(null);
  const [alreadySubmittedToday, setAlreadySubmittedToday] = useState(false);
  const [totalQuizMarks, setTotalQuizMarks] = useState(0);

  // 21-Day Timeline data
  const timelineDays = Array.from({ length: 21 }, (_, index) => ({
    day: index + 1,
    completed: index < Math.min(21, timeElapsed.days),
  }));

  const moods = [
    { id: '1', emoji: '😡', label: 'Angry' },
    { id: '2', emoji: '😢', label: 'Sad' },
    { id: '3', emoji: '😐', label: 'Neutral' },
    { id: '4', emoji: '😊', label: 'Happy' },
  ];

  // Submit Questionnaire and Trigger Notification directly to Notification Bar
  const handleSaveQuestionnaire = async () => {
    const today = new Date().toISOString().split('T')[0];

    if (lastSubmitDate === today) {
      Alert.alert('Notice', 'You have already completed your daily check-in today! Come back tomorrow.');
      setQuizModalVisible(false);
      return;
    }

    let earnedMarks = 0;
    if (avoidedRehab === true) earnedMarks += 25;
    if (resistedStrongUrges === true) earnedMarks += 25;
    if (completedHabitsToday === true) earnedMarks += 25;
    if (followedRoutine === true) earnedMarks += 25;

    setTotalQuizMarks(earnedMarks);
    setLastSubmitDate(today);
    setAlreadySubmittedToday(true);
    setQuizModalVisible(false);

    // --- PUSH NOTIFICATION TO NOTIFICATION BAR ---
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Well Done! 🎉',
        body: `You successfully completed today's check-in and earned ${earnedMarks}/100 marks. Keep it up!`,
        sound: true,
      },
      trigger: null, // ක්ෂණිකව Notification Bar එකට යැවීමට
    });

    Alert.alert('Success 🎉', `Daily check-in saved! You earned ${earnedMarks} marks today.`);
  };

  const calculateRehabProgress = () => {
    const quizScore = (totalQuizMarks / 100) * 40;
    let itemScore = 0;
    if (rehabs.length > 0) {
      const done = rehabs.filter(r => r.completedToday).length;
      itemScore = (done / rehabs.length) * 60;
    } else {
      itemScore = 60;
    }
    return Math.min(100, Math.round(quizScore + itemScore));
  };

  const calculateHabitProgress = () => {
    const quizScore = (totalQuizMarks / 100) * 40;
    let itemScore = 0;
    if (habits.length > 0) {
      const done = habits.filter(h => h.completedToday).length;
      itemScore = (done / habits.length) * 60;
    } else {
      itemScore = 60;
    }
    return Math.min(100, Math.round(quizScore + itemScore));
  };

  const rehabProgress = calculateRehabProgress();
  const habitProgress = calculateHabitProgress();

  const toggleHabitToday = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday } : h));
  };

  const toggleRehabToday = (id: string) => {
    setRehabs(rehabs.map(r => r.id === id ? { ...r, completedToday: !r.completedToday } : r));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scheduleHabitNotification = async (title: string, hour: number, minute: number) => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return undefined;

    const notifId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habit Reminder ⏰',
        body: `Time for your habit: "${title}"! Stay consistent.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return notifId;
  };

  const handleSaveHabit = async () => {
    if (!habitTitle.trim() || !habitTarget.trim()) {
      Alert.alert('Error', 'Please enter Habit Title and Target Date.');
      return;
    }

    const hour = habitReminderDate.getHours();
    const minute = habitReminderDate.getMinutes();
    const formattedTime = formatTime(habitReminderDate);

    if (editingHabitId) {
      const existingHabit = habits.find(h => h.id === editingHabitId);
      if (existingHabit?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(existingHabit.notificationId);
      }
      const newNotifId = await scheduleHabitNotification(habitTitle, hour, minute);

      setHabits(
        habits.map(h =>
          h.id === editingHabitId
            ? {
                ...h,
                title: habitTitle,
                dailyTime: formattedTime,
                reminderHour: hour,
                reminderMinute: minute,
                targetDate: habitTarget,
                notificationId: newNotifId,
              }
            : h
        )
      );
      Alert.alert('Updated', `Habit & daily reminder set for ${formattedTime}`);
    } else {
      const newNotifId = await scheduleHabitNotification(habitTitle, hour, minute);

      setHabits([
        ...habits,
        {
          id: Date.now().toString(),
          title: habitTitle,
          dailyTime: formattedTime,
          reminderHour: hour,
          reminderMinute: minute,
          targetDate: habitTarget,
          completedToday: false,
          notificationId: newNotifId,
        },
      ]);
      Alert.alert('Reminder Set 🔔', `You will get a daily reminder for "${habitTitle}" at ${formattedTime}.`);
    }

    setHabitModalVisible(false);
    setEditingHabitId(null);
    setHabitTitle('');
    setHabitTarget('');
  };

  const handleDeleteHabit = async (id: string) => {
    const habitToDelete = habits.find(h => h.id === id);
    if (habitToDelete?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(habitToDelete.notificationId);
    }
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
    setRehabTitle('');
    setRehabTarget('');
  };

  const handleDeleteRehab = (id: string) => {
    setRehabs(rehabs.filter(r => r.id !== id));
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]} showsVerticalScrollIndicator={false}>
      {/* 1. Daily Check-in Questionnaire Banner */}
      <Pressable style={[styles.quizTriggerBanner, isDarkMode ? styles.darkCard : styles.lightBanner]} onPress={() => setQuizModalVisible(true)}>
        <View style={styles.quizBannerLeft}>
          <View style={styles.quizIconCircle}>
            <Ionicons name="clipboard-outline" size={22} color="#0F766E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.quizBannerTitle, isDarkMode ? styles.textWhite : styles.textDark]}>
              Daily Check-in Questionnaire {alreadySubmittedToday ? '✓ (Completed)' : ''}
            </Text>
            <Text style={styles.quizBannerSub}>
              {alreadySubmittedToday ? `Today's Score: ${totalQuizMarks}/100 Marks` : 'Tap to answer questions & earn today’s marks'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#0F766E" />
      </Pressable>

      {/* 2. Special Pinned Counter */}
      <View style={[styles.pinnedContainer, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <View style={styles.pinnedHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="shield-checkmark" size={18} color="#7C3AED" />
            <Text style={[styles.pinnedTitle, isDarkMode ? styles.textPurple : styles.textDark]}>{pinnedRehab.title}</Text>
          </View>
          <Pressable onPress={() => { setTempPinnedTitle(pinnedRehab.title); setEditPinnedModal(true); }}>
            <Ionicons name="settings-outline" size={18} color="#7C3AED" />
          </Pressable>
        </View>

        <View style={styles.hugeDaysCard}>
          <Text style={styles.hugeDaysNumber}>{timeElapsed.days}</Text>
          <Text style={styles.hugeDaysLabel}>DAYS CLEAN / FREE</Text>
        </View>

        <View style={styles.timeBoxRow}>
          <View style={[styles.timeBoxBlue, isDarkMode && styles.darkSubCard]}>
            <Text style={[styles.timeNum, isDarkMode ? styles.textWhite : styles.textDark]}>{timeElapsed.hours}</Text>
            <Text style={styles.timeLbl}>hours</Text>
          </View>
          <View style={[styles.timeBoxPurple, isDarkMode && styles.darkSubCard]}>
            <Text style={[styles.timeNum, isDarkMode ? styles.textWhite : styles.textDark]}>{timeElapsed.minutes}</Text>
            <Text style={styles.timeLbl}>mins</Text>
          </View>
        </View>
      </View>

      {/* 3. Mood Tracker */}
      <Text style={[styles.sectionTitle, isDarkMode ? styles.textLightGreen : styles.textDark]}>How do you feel today?</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <Pressable
            key={m.id}
            style={[styles.moodCard, isDarkMode ? styles.darkCard : styles.lightCard, selectedMood === m.label && styles.selectedMoodCard]}
            onPress={() => { setSelectedMood(m.label); setMoodModalVisible(true); }}
          >
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
            <Text style={[styles.moodLabel, isDarkMode ? styles.textWhite : styles.textDark]}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* 4. BALANCED SECTIONS: Rehab vs Habit */}
      <View style={styles.balancedRow}>
        {/* REHAB SECTION */}
        <View style={styles.splitBoxRehab}>
          <View style={styles.splitHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.splitTitleWhite}>Rehab Programs</Text>
              <Text style={styles.splitSubGold}>Progress: {rehabProgress}%</Text>
            </View>
            <Pressable style={styles.addBtnGold} onPress={() => { setEditingRehabId(null); setRehabTitle(''); setRehabTarget(''); setRehabModalVisible(true); }}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.progBgWhite}>
            <View style={[styles.progFillGold, { width: `${rehabProgress}%` }]} />
          </View>

          <View style={styles.itemList}>
            {rehabs.map((r) => (
              <View key={r.id} style={styles.itemCardRehab}>
                <Pressable onPress={() => toggleRehabToday(r.id)} style={[styles.checkBoxWhite, r.completedToday && styles.checkedWhite]}>
                  {r.completedToday && <Ionicons name="checkmark" size={12} color="#065F46" />}
                </Pressable>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.itemTextWhite, r.completedToday && styles.crossedText]} numberOfLines={1}>{r.title}</Text>
                  <Text style={styles.itemSubLight}>Target: {r.targetDate}</Text>
                </View>
                <View style={styles.actionIcons}>
                  <Pressable onPress={() => { setEditingRehabId(r.id); setRehabTitle(r.title); setRehabTarget(r.targetDate); setRehabModalVisible(true); }}>
                    <Ionicons name="create-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  </Pressable>
                  <Pressable onPress={() => handleDeleteRehab(r.id)}>
                    <Ionicons name="trash-outline" size={16} color="#FCA5A5" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* HABIT SECTION */}
        <View style={styles.splitBoxHabit}>
          <View style={styles.splitHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.splitTitleDark}>Habit Tracker</Text>
              <Text style={styles.splitSubBlue}>Progress: {habitProgress}%</Text>
            </View>
            <Pressable
              style={styles.addBtnBlue}
              onPress={() => {
                setEditingHabitId(null);
                setHabitTitle('');
                setHabitTarget('');
                setHabitReminderDate(new Date());
                setHabitModalVisible(true);
              }}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.progBgBlue}>
            <View style={[styles.progFillBlue, { width: `${habitProgress}%` }]} />
          </View>

          <View style={styles.itemList}>
            {habits.map((h) => (
              <View key={h.id} style={styles.itemCardHabit}>
                <Pressable onPress={() => toggleHabitToday(h.id)} style={[styles.checkBoxBlue, h.completedToday && styles.checkedBlue]}>
                  {h.completedToday && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </Pressable>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.itemTextDark, h.completedToday && styles.crossedTextDark]} numberOfLines={1}>{h.title}</Text>
                  <Text style={styles.itemSubGray}>🔔 Reminder: {h.dailyTime}</Text>
                </View>
                <View style={styles.actionIcons}>
                  <Pressable
                    onPress={() => {
                      setEditingHabitId(h.id);
                      setHabitTitle(h.title);
                      setHabitTarget(h.targetDate);
                      const d = new Date();
                      d.setHours(h.reminderHour, h.reminderMinute);
                      setHabitReminderDate(d);
                      setHabitModalVisible(true);
                    }}
                  >
                    <Ionicons name="create-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  </Pressable>
                  <Pressable onPress={() => handleDeleteHabit(h.id)}>
                    <Ionicons name="trash-outline" size={16} color="#FCA5A5" />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 5. 21-Day Timeline Progress Card */}
      <View style={[styles.statsCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.statsTitle, isDarkMode ? styles.textWhite : styles.textDark]}>21-Day Recovery Milestone Progress 📊</Text>
        <Text style={styles.timelineSub}>Week 1, Week 2 & Week 3 Milestones</Text>

        <View style={styles.timelineGrid}>
          {timelineDays.map((item) => (
            <View key={item.day} style={[styles.timelineNode, item.completed ? styles.nodeCompleted : (isDarkMode ? styles.darkNode : styles.nodePending)]}>
              <Text style={[styles.nodeText, item.completed && { color: '#FFFFFF' }]}>D{item.day}</Text>
              {item.completed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
            </View>
          ))}
        </View>
        <Text style={styles.progressText}>{Math.min(21, timeElapsed.days)} / 21 Days Completed Successfully!</Text>
      </View>

      {/* Daily Questionnaire Modal */}
      <Modal visible={quizModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Daily Check-in 📋</Text>
              <Pressable onPress={() => setQuizModalVisible(false)}>
                <Ionicons name="close" size={22} color={isDarkMode ? '#FFF' : '#666'} />
              </Pressable>
            </View>

            {alreadySubmittedToday ? (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
                <Text style={[styles.modalTitle, { marginTop: 10, textAlign: 'center' }, isDarkMode ? styles.textWhite : styles.textDark]}>
                  Already Completed Today!
                </Text>
                <Text style={[styles.modalBody, { marginTop: 5, textAlign: 'center', color: '#64748B' }]}>
                  You have already submitted your questionnaire today and earned {totalQuizMarks}/100 marks. Come back tomorrow!
                </Text>
                <Pressable style={styles.submitQuizBtn} onPress={() => setQuizModalVisible(false)}>
                  <Text style={styles.submitQuizText}>Close</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.quizCategoryTag}>REHAB & AVOIDANCE</Text>
                <Text style={[styles.quizQuestion, isDarkMode ? styles.textWhite : styles.textDark]}>1. Did you avoid all bad habits / substances today? (+25 Marks)</Text>
                <View style={styles.quizRow}>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, avoidedRehab === true && styles.quizBtnGreen]} onPress={() => setAvoidedRehab(true)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, avoidedRehab === true && styles.quizBtnTextSelected]}>Yes</Text>
                  </Pressable>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, avoidedRehab === false && styles.quizBtnRed]} onPress={() => setAvoidedRehab(false)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, avoidedRehab === false && styles.quizBtnTextSelected]}>No</Text>
                  </Pressable>
                </View>

                <Text style={[styles.quizQuestion, isDarkMode ? styles.textWhite : styles.textDark]}>2. Did you successfully resist strong urges today? (+25 Marks)</Text>
                <View style={styles.quizRow}>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, resistedStrongUrges === true && styles.quizBtnGreen]} onPress={() => setResistedStrongUrges(true)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, resistedStrongUrges === true && styles.quizBtnTextSelected]}>Yes</Text>
                  </Pressable>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, resistedStrongUrges === false && styles.quizBtnRed]} onPress={() => setResistedStrongUrges(false)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, resistedStrongUrges === false && styles.quizBtnTextSelected]}>No</Text>
                  </Pressable>
                </View>

                <Text style={[styles.quizCategoryTag, { color: '#059669', marginTop: 6 }]}>HABIT & ROUTINE</Text>
                <Text style={[styles.quizQuestion, isDarkMode ? styles.textWhite : styles.textDark]}>3. Did you complete your positive daily habits? (+25 Marks)</Text>
                <View style={styles.quizRow}>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, completedHabitsToday === true && styles.quizBtnBlue]} onPress={() => setCompletedHabitsToday(true)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, completedHabitsToday === true && styles.quizBtnTextSelected]}>Yes</Text>
                  </Pressable>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, completedHabitsToday === false && styles.quizBtnRed]} onPress={() => setCompletedHabitsToday(false)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, completedHabitsToday === false && styles.quizBtnTextSelected]}>No</Text>
                  </Pressable>
                </View>

                <Text style={[styles.quizQuestion, isDarkMode ? styles.textWhite : styles.textDark]}>4. Did you stay consistent with your schedule? (+25 Marks)</Text>
                <View style={styles.quizRow}>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, followedRoutine === true && styles.quizBtnBlue]} onPress={() => setFollowedRoutine(true)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, followedRoutine === true && styles.quizBtnTextSelected]}>Yes</Text>
                  </Pressable>
                  <Pressable style={[styles.quizBtn, isDarkMode && styles.darkSubCard, followedRoutine === false && styles.quizBtnRed]} onPress={() => setFollowedRoutine(false)}>
                    <Text style={[styles.quizBtnText, isDarkMode && styles.textWhite, followedRoutine === false && styles.quizBtnTextSelected]}>No</Text>
                  </Pressable>
                </View>

                <Pressable style={styles.submitQuizBtn} onPress={handleSaveQuestionnaire}>
                  <Text style={styles.submitQuizText}>Submit & Get Marks ✓</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Configure Pinned Rehab Modal */}
      <Modal visible={editPinnedModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Configure Pinned Counter</Text>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} value={tempPinnedTitle} onChangeText={setTempPinnedTitle} />

            <Text style={styles.inputLabel}>Select Start Date (Calendar)</Text>
            <Pressable style={[styles.calendarTriggerBtn, isDarkMode && styles.darkSubCard]} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={18} color="#7C3AED" />
              <Text style={[styles.calendarTriggerText, isDarkMode && styles.textWhite]}>{pinnedDate.toISOString().split('T')[0]}</Text>
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

      {/* Habit Modal */}
      <Modal visible={habitModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark, { marginBottom: 10 }]}>
              {editingHabitId ? 'Edit Habit & Reminder' : 'Add New Habit'}
            </Text>

            <Text style={styles.inputLabel}>Habit Title</Text>
            <TextInput
              style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
              placeholder="e.g. Morning Exercise"
              placeholderTextColor="#888"
              value={habitTitle}
              onChangeText={setHabitTitle}
            />

            <Text style={styles.inputLabel}>Daily Reminder Time 🔔</Text>
            <Pressable style={[styles.calendarTriggerBtn, isDarkMode && styles.darkSubCard]} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="alarm-outline" size={18} color="#2563EB" />
              <Text style={[styles.calendarTriggerText, isDarkMode && styles.textWhite]}>{formatTime(habitReminderDate)}</Text>
            </Pressable>

            {showTimePicker && (
              <DateTimePicker
                value={habitReminderDate}
                mode="time"
                display="default"
                onChange={(e, selectedTime) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (selectedTime) setHabitReminderDate(selectedTime);
                }}
              />
            )}

            <Text style={styles.inputLabel}>Target Date (YYYY-MM-DD)</Text>
            <TextInput
              style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
              placeholder="e.g. 2026-12-31"
              placeholderTextColor="#888"
              value={habitTarget}
              onChangeText={setHabitTarget}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.primaryBtn} onPress={handleSaveHabit}>
                <Text style={styles.btnText}>Save & Set Reminder</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setHabitModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rehab Modal */}
      <Modal visible={rehabModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark, { marginBottom: 10 }]}>
              {editingRehabId ? 'Edit Rehab' : 'Add Rehab Program'}
            </Text>
            <TextInput style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} placeholder="Rehab Title" placeholderTextColor="#888" value={rehabTitle} onChangeText={setRehabTitle} />
            <TextInput style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} placeholder="Target Date (YYYY-MM-DD)" placeholderTextColor="#888" value={rehabTarget} onChangeText={setRehabTarget} />
            <View style={styles.modalActions}>
              <Pressable style={styles.primaryBtn} onPress={handleSaveRehab}><Text style={styles.btnText}>Save</Text></Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setRehabModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mood Logged Modal */}
      <Modal visible={moodModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentSmall, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Mood Recorded!</Text>
            <Text style={[styles.modalBody, isDarkMode ? styles.textGray : styles.textDark]}>You selected: <Text style={{ fontWeight: 'bold' }}>{selectedMood}</Text>.</Text>
            <Pressable style={styles.primaryBtn} onPress={() => setMoodModalVisible(false)}><Text style={styles.btnText}>OK</Text></Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, paddingTop: 40 },
  darkBg: { backgroundColor: '#0F172A' },
  lightBg: { backgroundColor: '#F8FAFC' },

  darkCard: { backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1 },
  lightCard: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 },
  lightBanner: { backgroundColor: '#F0FDFA', borderColor: '#CCFBF1', borderWidth: 1 },

  darkSubCard: { backgroundColor: '#0F172A', borderColor: '#334155' },
  darkNode: { backgroundColor: '#334155' },

  quizTriggerBanner: { padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, elevation: 1 },
  quizBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  quizIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#99F6E4', justifyContent: 'center', alignItems: 'center' },
  quizBannerTitle: { fontSize: 14, fontWeight: 'bold' },
  quizBannerSub: { color: '#64748B', fontSize: 10, marginTop: 1 },

  pinnedContainer: { padding: 14, borderRadius: 16, marginBottom: 12, elevation: 2 },
  pinnedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pinnedTitle: { fontSize: 14, fontWeight: 'bold' },

  hugeDaysCard: { backgroundColor: '#7C3AED', paddingVertical: 18, borderRadius: 14, alignItems: 'center', marginBottom: 10, elevation: 2 },
  hugeDaysNumber: { fontSize: 44, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  hugeDaysLabel: { fontSize: 11, fontWeight: '700', color: '#DDD6FE', letterSpacing: 1.5, marginTop: 2 },

  timeBoxRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  timeBoxBlue: { flex: 1, backgroundColor: '#EFF6FF', paddingVertical: 8, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#DBEAFE' },
  timeBoxPurple: { flex: 1, backgroundColor: '#F3E8FF', paddingVertical: 8, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF' },
  timeNum: { fontSize: 18, fontWeight: 'bold' },
  timeLbl: { fontSize: 10, color: '#64748B', fontWeight: '600' },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  moodCard: { padding: 8, borderRadius: 12, alignItems: 'center', width: '22%', elevation: 1 },
  selectedMoodCard: { borderWidth: 2, borderColor: '#7C3AED' },
  moodEmoji: { fontSize: 18, marginBottom: 2 },
  moodLabel: { fontSize: 10, fontWeight: '500' },

  balancedRow: { gap: 12, marginBottom: 15 },

  splitBoxRehab: { backgroundColor: '#065F46', padding: 14, borderRadius: 16, elevation: 2 },
  splitHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  splitTitleWhite: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  splitSubGold: { fontSize: 11, color: '#FCD34D', fontWeight: '600' },
  addBtnGold: { backgroundColor: '#FCD34D', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  progBgWhite: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progFillGold: { height: '100%', backgroundColor: '#FCD34D', borderRadius: 3 },
  itemCardRehab: { backgroundColor: 'rgba(255,255,255,0.12)', padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#047857' },
  checkBoxWhite: { width: 18, height: 18, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  checkedWhite: { backgroundColor: '#FFFFFF' },
  itemTextWhite: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  crossedText: { textDecorationLine: 'line-through', color: '#A7F3D0' },
  itemSubLight: { fontSize: 10, color: '#D1FAE5', marginTop: 1 },

  splitBoxHabit: { backgroundColor: '#1E40AF', padding: 14, borderRadius: 16, elevation: 2 },
  splitTitleDark: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  splitSubBlue: { fontSize: 11, color: '#93C5FD', fontWeight: '600' },
  addBtnBlue: { backgroundColor: '#93C5FD', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  progBgBlue: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progFillBlue: { height: '100%', backgroundColor: '#93C5FD', borderRadius: 3 },
  itemCardHabit: { backgroundColor: 'rgba(255,255,255,0.12)', padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1D4ED8' },
  checkBoxBlue: { width: 18, height: 18, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  checkedBlue: { backgroundColor: '#FFFFFF' },
  itemTextDark: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  crossedTextDark: { textDecorationLine: 'line-through', color: '#93C5FD' },
  itemSubGray: { fontSize: 10, color: '#DBEAFE', marginTop: 1 },

  itemList: { gap: 8 },
  actionIcons: { flexDirection: 'row', alignItems: 'center' },

  statsCard: { padding: 16, borderRadius: 16, marginBottom: 40, elevation: 1 },
  statsTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  timelineSub: { fontSize: 11, color: '#64748B', marginBottom: 12 },
  timelineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 12 },
  timelineNode: { width: 38, height: 38, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  nodeCompleted: { backgroundColor: '#059669' },
  nodePending: { backgroundColor: '#F1F5F9' },
  nodeText: { fontSize: 10, fontWeight: 'bold', color: '#475569' },
  progressText: { fontSize: 11, fontWeight: '600', color: '#059669', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { padding: 20, borderRadius: 16, width: '88%', borderWidth: 1, borderColor: '#334155' },
  modalContentSmall: { padding: 20, borderRadius: 14, width: '75%', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: 'bold' },
  modalBody: { fontSize: 12, textAlign: 'center', marginBottom: 15 },

  quizCategoryTag: { fontSize: 10, fontWeight: 'bold', color: '#0D9488', marginTop: 4 },
  quizQuestion: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  quizRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  quizBtn: { flex: 1, paddingVertical: 6, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, alignItems: 'center', backgroundColor: '#F8FAFC' },
  quizBtnGreen: { backgroundColor: '#059669', borderColor: '#059669' },
  quizBtnRed: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  quizBtnBlue: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
  quizBtnText: { fontSize: 11, color: '#334155', fontWeight: '600' },
  quizBtnTextSelected: { color: '#FFFFFF' },
  submitQuizBtn: { backgroundColor: '#0F766E', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitQuizText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },

  inputLabel: { fontSize: 11, color: '#64748B', marginBottom: 3, fontWeight: '600' },
  input: { borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 10, fontSize: 13 },
  darkInput: { borderColor: '#475569', backgroundColor: '#0F172A', color: '#FFFFFF' },
  lightInput: { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC', color: '#000000' },

  calendarTriggerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, marginBottom: 12 },
  calendarTriggerText: { fontWeight: 'bold', fontSize: 13 },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  primaryBtn: { backgroundColor: '#7C3AED', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 10 },
  cancelText: { color: '#64748B', fontSize: 12 },

  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#1E293B' },
  textPurple: { color: '#A78BFA' },
  textLightGreen: { color: '#34D399' },
  textGray: { color: '#94A3B8' }
});