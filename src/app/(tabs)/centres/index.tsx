import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../_layout';

export default function CentersScreen() {
  const { isDarkMode } = useAppTheme();

  const centers = [
    {
      id: 'c1',
      title: 'Serenity Recovery & Counseling Center',
      address: '123 Hope Avenue, Colombo 07',
      phone: '+94 11 234 5678',
      desc: 'Professional guidance, group therapy, and rehabilitation support.'
    },
    {
      id: 'c2',
      title: 'Mind & Body Wellness Hub',
      address: '45 Peace Street, Kandy',
      phone: '+94 81 223 3445',
      desc: 'Specialized counseling and behavioral therapy sessions.'
    }
  ];

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.headerTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Recovery Centers & Support</Text>
      <Text style={styles.headerSub}></Text>

      {/* Centers List */}
      {centers.map((c) => (
        <View key={c.id} style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
          <View style={styles.iconBox}>
            <Ionicons name="business-outline" size={22} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, isDarkMode ? styles.textWhite : styles.textDark]}>{c.title}</Text>
            <Text style={styles.cardDesc}>{c.desc}</Text>
            <Text style={styles.cardInfo}>📍 {c.address}</Text>
            <Text style={styles.cardInfo}>📞 {c.phone}</Text>
          </View>
        </View>
      ))}

      {/* Community Join Section (Directly under Centers) */}
      <View style={[styles.communityBanner, isDarkMode ? styles.darkCard : styles.lightCommunityCard]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Ionicons name="people-circle" size={26} color="#059669" />
          <Text style={[styles.communityTitle, isDarkMode ? styles.textWhite : styles.textDark]}>Join Our Support Community</Text>
        </View>
        <Text style={styles.communitySub}>Connect with others on the same journey, share experiences, and get daily inspiration on our social channels.</Text>
        
        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtnTelegram} onPress={() => Linking.openURL('https://t.me/your_community_link')}>
            <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
            <Text style={styles.socialBtnText}>Telegram Group</Text>
          </Pressable>

          <Pressable style={styles.socialBtnWhatsApp} onPress={() => Linking.openURL('https://whatsapp.com/channel/your_link')}>
            <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
            <Text style={styles.socialBtnText}>WhatsApp Community</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  darkBg: { backgroundColor: '#0F172A' },
  lightBg: { backgroundColor: '#F8FAFC' },

  darkCard: { backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1 },
  lightCard: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 },
  lightCommunityCard: { backgroundColor: '#F0FDFA', borderColor: '#CCFBF1', borderWidth: 1 },

  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerSub: { fontSize: 13, color: '#64748B', marginBottom: 16 },

  card: { padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, elevation: 1, gap: 12 },
  iconBox: { backgroundColor: 'rgba(5, 150, 105, 0.15)', padding: 10, borderRadius: 8 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#64748B', marginBottom: 6 },
  cardInfo: { fontSize: 11, color: '#059669', fontWeight: '600', marginTop: 2 },

  communityBanner: { padding: 16, borderRadius: 12, marginTop: 10, marginBottom: 40 },
  communityTitle: { fontSize: 15, fontWeight: 'bold' },
  communitySub: { fontSize: 12, color: '#64748B', marginBottom: 12, lineHeight: 18 },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtnTelegram: { flex: 1, backgroundColor: '#229ED9', paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  socialBtnWhatsApp: { flex: 1, backgroundColor: '#25D366', paddingVertical: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  socialBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },

  textWhite: { color: '#FFFFFF' },
  textDark: { color: '#1E293B' }
});