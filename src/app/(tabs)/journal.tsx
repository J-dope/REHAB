import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recovery Journal</Text>
      <Text style={styles.sub}>REHAB - Recovery with Hope</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#174C3C',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: '#666',
  },
});