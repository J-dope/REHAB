import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RehabDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [title, setTitle] = useState(params.title as string || 'Rehab Program');
  const [duration, setDuration] = useState(params.duration as string || '30 mins');
  const startDate = params.startDate as string || '2026-11-01';
  const targetDays = params.targetDays ? Number(params.targetDays) : 30;

  // System automatic calculations
  const startTimestamp = new Date(startDate).getTime();
  const nowTimestamp = new Date().getTime();
  const elapsedDays = Math.max(0, Math.floor((nowTimestamp - startTimestamp) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.round((elapsedDays / targetDays) * 100));

  const handleUpdate = () => {
    Alert.alert("Success", "Rehab program details updated successfully!");
  };

  const handleDelete = () => {
    Alert.alert("Deleted", "Program deleted successfully.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#174C3C" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.headerTitle}>Program Details & System Progress</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Program Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Duration</Text>
        <TextInput style={styles.input} value={duration} onChangeText={setDuration} />

        <View style={styles.statsBox}>
          <Text style={styles.statText}>📅 Started Date: <Text style={{fontWeight: 'bold'}}>{startDate}</Text></Text>
          <Text style={styles.statText}>⏳ Time Elapsed: <Text style={{fontWeight: 'bold'}}>{elapsedDays} Days Active</Text></Text>
          <Text style={styles.statText}>🎯 Target Goal: <Text style={{fontWeight: 'bold'}}>{targetDays} Days</Text></Text>
          <Text style={styles.statText}>📊 System Calculated Progress: <Text style={{fontWeight: 'bold', color: '#174C3C'}}>{progressPercent}% Completed</Text></Text>
        </View>

        <Pressable style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.btnText}>Update Program</Text>
        </Pressable>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Program</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 50 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15 },
  backText: { color: '#174C3C', fontWeight: 'bold', fontSize: 14 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#174C3C', marginBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 14, elevation: 1 },
  label: { fontSize: 12, color: '#666', fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#E2ECE9', padding: 10, borderRadius: 8, marginBottom: 14, fontSize: 14, color: '#333' },
  statsBox: { backgroundColor: '#F5F8F5', padding: 14, borderRadius: 8, marginBottom: 20, gap: 8 },
  statText: { fontSize: 13, color: '#333' },
  updateBtn: { backgroundColor: '#174C3C', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  deleteBtn: { backgroundColor: '#FFEEEE', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  deleteText: { color: '#D9534F', fontWeight: 'bold', fontSize: 14 }
});