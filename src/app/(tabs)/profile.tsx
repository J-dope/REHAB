import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('Janaka Ekanayake');
  const [userEmail, setUserEmail] = useState('janaka.rehab@gmail.com');
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);

  const totalCleanDays = 59;

  const timelineDays = Array.from({ length: 21 }, (_, index) => ({
    day: index + 1,
    completed: index < 14,
  }));

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImg(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    setUserName(tempName);
    setUserEmail(tempEmail);
    setEditModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Pressable onPress={pickImageFromGallery} style={styles.avatarContainer}>
          {profileImg ? (
            <Image source={{ uri: profileImg }} style={styles.avatarImage} />
          ) : (
            <View style={styles.bigAvatar}>
              <Ionicons name="person" size={40} color="#174C3C" />
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={12} color="#FFFFFF" />
          </View>
        </Pressable>

        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>

        <Pressable style={styles.editBtn} onPress={() => { setTempName(userName); setTempEmail(userEmail); setEditModalVisible(true); }}>
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </Pressable>
      </View>

      {/* Clean Days & Timeline Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Total Clean Days: {totalCleanDays} Days 🌟</Text>
        <Text style={styles.timelineSub}>21-Day Recovery Milestone Progress</Text>
        
        <View style={styles.timelineGrid}>
          {timelineDays.map((item) => (
            <View key={item.day} style={[styles.timelineNode, item.completed ? styles.nodeCompleted : styles.nodePending]}>
              <Text style={[styles.nodeText, item.completed && { color: '#FFFFFF' }]}>D{item.day}</Text>
              {item.completed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
            </View>
          ))}
        </View>
        <Text style={styles.progressText}>14 / 21 Days Completed Successfully!</Text>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.input} value={tempName} onChangeText={setTempName} />

            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} value={tempEmail} onChangeText={setUserEmail} />

            <Pressable style={styles.galleryBtn} onPress={pickImageFromGallery}>
              <Ionicons name="image-outline" size={18} color="#174C3C" />
              <Text style={styles.galleryBtnText}>Select Photo from Gallery</Text>
            </Pressable>

            <View style={styles.modalActions}>
              <Pressable style={styles.saveBtn} onPress={handleSaveProfile}><Text style={styles.saveBtnText}>Save</Text></Pressable>
              <Pressable style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 50 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  bigAvatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#E2ECE9', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 84, height: 84, borderRadius: 42 },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#174C3C', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#174C3C' },
  email: { fontSize: 13, color: '#666', marginBottom: 10 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#174C3C', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  editBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  statsCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 14, marginBottom: 20, elevation: 1 },
  statsTitle: { fontSize: 16, fontWeight: 'bold', color: '#174C3C', marginBottom: 4 },
  timelineSub: { fontSize: 12, color: '#666', marginBottom: 15 },
  timelineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 15 },
  timelineNode: { width: 42, height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  nodeCompleted: { backgroundColor: '#4E9F3D' },
  nodePending: { backgroundColor: '#E2ECE9' },
  nodeText: { fontSize: 11, fontWeight: 'bold', color: '#444' },
  progressText: { fontSize: 12, fontWeight: '600', color: '#174C3C', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', padding: 22, borderRadius: 14, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#174C3C', marginBottom: 15 },
  inputLabel: { fontSize: 12, color: '#666', marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#E2ECE9', padding: 10, borderRadius: 8, marginBottom: 14, fontSize: 14 },
  galleryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#174C3C', padding: 10, borderRadius: 8, marginBottom: 15, backgroundColor: '#E2ECE9' },
  galleryBtnText: { color: '#174C3C', fontWeight: 'bold', fontSize: 13 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  saveBtn: { backgroundColor: '#174C3C', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 6 },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  cancelText: { color: '#666' }
});