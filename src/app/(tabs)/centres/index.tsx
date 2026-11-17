import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Centre {
  id: string;
  name: string;
  location: string;
  contact: string;
}

export default function CentresScreen() {
  const centresList: Centre[] = [
    { id: '1', name: 'National Dangerous Drugs Control Board', location: 'Rajagiriya', contact: '011-2889588' },
    { id: '2', name: 'Nawodaya Treatment Centre', location: 'Colombo', contact: '011-2691111' },
    { id: '3', name: 'Sahanaya Counseling Centre', location: 'Maharagama', contact: '011-2838383' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Rehabilitation Centres</Text>
      <Text style={styles.headerSub}>Find verified support and treatment facilities near you.</Text>

      <FlatList<Centre>
        data={centresList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.centreCard}>
            <View style={styles.iconBox}>
              <Ionicons name="medical" size={22} color="#174C3C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.centreName}>{item.name}</Text>
              <Text style={styles.centreLocation}>📍 {item.location}</Text>
              <Text style={styles.centreContact}>📞 {item.contact}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F5', padding: 16, paddingTop: 60 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#174C3C' },
  headerSub: { fontSize: 13, color: '#666', marginBottom: 16 },
  centreCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 1, gap: 12 },
  iconBox: { backgroundColor: '#E2ECE9', padding: 10, borderRadius: 8 },
  centreName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  centreLocation: { fontSize: 13, color: '#555', marginTop: 2 },
  centreContact: { fontSize: 13, color: '#174C3C', fontWeight: '600', marginTop: 2 }
});