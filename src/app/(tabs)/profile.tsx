import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Modal, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '../_layout'; // Global theme එක ලබාගැනීම සඳහා

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useAppTheme();

  // Profile States
  const [name, setName] = useState('Rehab & Habit Warrior');
  const [email, setEmail] = useState('warrior@recovery.app');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  // Notification States
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);

  // Backup Modal State
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState('Today, 10:45 AM');

  // Image Picker Function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    if (!tempName.trim() || !tempEmail.trim()) {
      Alert.alert('Error', 'Name and email cannot be empty.');
      return;
    }
    setName(tempName);
    setEmail(tempEmail);
    setEditProfileModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCloudBackup = () => {
    const currentTime = new Date().toLocaleString();
    setLastBackupTime(currentTime);
    setBackupModalVisible(false);
    Alert.alert('Success 🎉', 'Your progress and streak data have been successfully backed up to the cloud.');
  };

  const handleRestoreData = () => {
    Alert.alert('Restore Data', 'Are you sure you want to restore your progress from the latest backup?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Restore', onPress: () => Alert.alert('Success', 'Data restored successfully!') }
    ]);
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]} showsVerticalScrollIndicator={false}>
      {/* Profile Header with Photo Upload & Edit Option */}
      <View style={[styles.headerCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <Pressable onPress={pickImage} style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={12} color="#FFFFFF" />
          </View>
        </Pressable>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={[styles.profileName, isDarkMode ? styles.textWhite : styles.textDark]}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <Pressable 
          style={styles.editBtn} 
          onPress={() => { setTempName(name); setTempEmail(email); setEditProfileModal(true); }}
        >
          <Ionicons name="create-outline" size={16} color="#34D399" />
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable>
      </View>

      {/* 1. THEME SETTINGS SECTION (Global Dark/Light Toggle) */}
      <Text style={[styles.sectionHeader, isDarkMode ? styles.textLightGreen : styles.textDarkGreen]}>Appearance & Theme</Text>
      <View style={[styles.settingsCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="moon-outline" size={18} color="#7C3AED" />
            </View>
            <View>
              <Text style={[styles.settingTitle, isDarkMode ? styles.textWhite : styles.textDark]}>App Dark Mode</Text>
              <Text style={styles.settingSub}>Applies dark theme across entire app</Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: '#7C3AED' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* 2. NOTIFICATIONS SETTINGS SECTION */}
      <Text style={[styles.sectionHeader, isDarkMode ? styles.textLightGreen : styles.textDarkGreen]}>Notifications & Reminders</Text>
      <View style={[styles.settingsCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="notifications-outline" size={18} color="#D97706" />
            </View>
            <View>
              <Text style={[styles.settingTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Daily Check-in Reminder</Text>
              <Text style={styles.settingSub}>Get reminded to log daily questions</Text>
            </View>
          </View>
          <Switch
            value={dailyReminder}
            onValueChange={setDailyReminder}
            trackColor={{ false: '#CBD5E1', true: '#059669' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="flame-outline" size={18} color="#DC2626" />
            </View>
            <View>
              <Text style={[styles.settingTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Streak Protection Alerts</Text>
              <Text style={styles.settingSub}>Alerts to keep your clean streak safe</Text>
            </View>
          </View>
          <Switch
            value={streakAlerts}
            onValueChange={setStreakAlerts}
            trackColor={{ false: '#CBD5E1', true: '#059669' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* 3. DATA BACKUP SECTION */}
      <Text style={[styles.sectionHeader, isDarkMode ? styles.textLightGreen : styles.textDarkGreen]}>Data Backup & Cloud Sync</Text>
      <View style={[styles.settingsCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <View style={styles.backupInfoRow}>
          <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="cloud-done-outline" size={18} color="#059669" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.settingTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Cloud Backup Status</Text>
            <Text style={styles.settingSub}>Last backed up: {lastBackupTime}</Text>
          </View>
        </View>

        <View style={styles.backupActionRow}>
          <Pressable style={styles.backupBtnPrimary} onPress={() => setBackupModalVisible(true)}>
            <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
            <Text style={styles.backupBtnTextPrimary}>Backup Now</Text>
          </Pressable>

          <Pressable style={[styles.backupBtnSecondary, isDarkMode ? styles.darkBtnBorder : styles.lightBtnBorder]} onPress={handleRestoreData}>
            <Ionicons name="cloud-download-outline" size={16} color={isDarkMode ? '#A7F3D0' : '#059669'} />
            <Text style={[styles.backupBtnTextSecondary, isDarkMode ? { color: '#A7F3D0' } : { color: '#059669' }]}>Restore</Text>
          </Pressable>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput 
              style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} 
              value={tempName} 
              onChangeText={setTempName} 
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} 
              value={tempEmail} 
              onChangeText={setTempEmail} 
              keyboardType="email-address"
            />

            <View style={styles.modalActionsRow}>
              <Pressable style={styles.primaryBtn} onPress={handleSaveProfile}>
                <Text style={styles.btnText}>Save Changes</Text>
              </Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setEditProfileModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Backup Confirmation Modal */}
      <Modal visible={backupModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="cloud-upload" size={28} color="#059669" />
            </View>
            <Text style={[styles.modalTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Cloud Backup</Text>
            <Text style={styles.modalBody}>This will securely save your clean streak counter, rehab goals, and habit records to your cloud storage.</Text>
            
            <View style={styles.modalActions}>
              <Pressable style={styles.modalConfirmBtn} onPress={handleCloudBackup}>
                <Text style={styles.modalConfirmText}>Confirm Backup</Text>
              </Pressable>
              <Pressable style={styles.modalCancelBtn} onPress={() => setBackupModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40, marginBottom: 20 },
  darkBg: { backgroundColor: '#0F172A' },
  lightBg: { backgroundColor: '#F8FAFC' },

  headerCard: { padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 20, elevation: 2, borderWidth: 1, borderColor: '#334155' },
  darkCard: { backgroundColor: '#1E293B', borderColor: '#334155' },
  lightCard: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },

  avatarContainer: { position: 'relative' },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 52, height: 52, borderRadius: 26 },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0284C7', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFFFFF' },

  profileName: { fontSize: 16, fontWeight: 'bold' },
  profileEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(52, 211, 153, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { fontSize: 12, fontWeight: 'bold', color: '#34D399' },

  sectionHeader: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  textLightGreen: { color: '#34D399' },
  textDarkGreen: { color: '#047857' },

  settingsCard: { padding: 14, borderRadius: 16, marginBottom: 16, elevation: 1, borderWidth: 1 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingRight: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingTitle: { fontSize: 14, fontWeight: '600' },
  settingSub: { fontSize: 11, color: '#64748B', marginTop: 1 },
  divider: { height: 1, backgroundColor: 'rgba(100, 116, 139, 0.2)', marginVertical: 10 },

  backupInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backupActionRow: { flexDirection: 'row', gap: 10 },
  backupBtnPrimary: { flex: 1, backgroundColor: '#059669', paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  backupBtnTextPrimary: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  backupBtnSecondary: { flex: 1, paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1 },
  darkBtnBorder: { borderColor: '#34D399' },
  lightBtnBorder: { borderColor: '#059669' },
  backupBtnTextSecondary: { fontWeight: 'bold', fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { padding: 22, borderRadius: 16, width: '85%', borderWidth: 1, borderColor: '#334155' },
  modalIconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(5, 150, 105, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, alignSelf: 'center' },
  modalTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 12 },
  modalBody: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  
  inputLabel: { fontSize: 11, color: '#64748B', marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 14, fontSize: 13 },
  darkInput: { borderColor: '#475569', backgroundColor: '#0F172A', color: '#FFFFFF' },
  lightInput: { borderColor: '#CBD5E1', backgroundColor: '#F8FAFC', color: '#000000' },

  modalActionsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  primaryBtn: { flex: 1, backgroundColor: '#059669', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: '600', fontSize: 12 },

  modalActions: { width: '100%', gap: 8 },
  modalConfirmBtn: { backgroundColor: '#059669', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modalConfirmText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  modalCancelBtn: { paddingVertical: 8, alignItems: 'center' },
  modalCancelText: { color: '#64748B', fontWeight: '600', fontSize: 12 },

  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#1E293B' }
});