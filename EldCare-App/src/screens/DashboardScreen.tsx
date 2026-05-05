import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import api from '../config/api';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DashboardScreen = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const year = 2026;
  const [schedules, setSchedules] = useState<any[]>([]);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<any[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data || []);
    } catch (error) {
      console.log("Error fetching schedules", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentMonthIndex]);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonthIndex, year);
  const firstDay = getFirstDayOfMonth(currentMonthIndex, year);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const openDayDetails = (day: number) => {
    const dateStr = `${year}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const daySchedules = schedules.filter(s => s.consumptionDate === dateStr);
    
    setSelectedDateStr(`${months[currentMonthIndex]} ${day}, ${year}`);
    setSelectedDaySchedules(daySchedules);
    setShowDayModal(true);
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/notifications', {
        notificationType: "Daily Check In",
        status: true,
        time: new Date().toISOString()
      });
      setHasCheckedInToday(true);
    } catch (error) {
      Alert.alert("Error", "Could not check in.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentMonthIndex(prev => Math.max(0, prev - 1))}>
          <Text style={styles.navText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{months[currentMonthIndex]} {year}</Text>
        <TouchableOpacity onPress={() => setCurrentMonthIndex(prev => Math.min(11, prev + 1))}>
          <Text style={styles.navText}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        <View style={styles.daysRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <Text key={d} style={styles.dayName}>{d}</Text>
          ))}
        </View>
        <View style={styles.grid}>
          {blanks.map(b => <View key={`blank-${b}`} style={styles.dayCell} />)}
          {days.map(day => (
            <TouchableOpacity key={day} style={styles.dayCell} onPress={() => openDayDetails(day)}>
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {hasCheckedInToday ? (
          <Text style={styles.checkedInText}>You have checked in for the day.</Text>
        ) : (
          <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
            <Text style={styles.checkInButtonText}>Check-In</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={showDayModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDateStr}</Text>
            <ScrollView>
              {selectedDaySchedules.length === 0 ? (
                <Text style={styles.noData}>No medications scheduled.</Text>
              ) : (
                selectedDaySchedules.map((med, idx) => (
                  <View key={idx} style={[styles.medCard, { borderLeftColor: med.color || '#3B82F6' }]}>
                    <Text style={styles.medName}>{med.medicationName}</Text>
                    <Text style={styles.medTime}>{med.consumptionTime} - {med.dosage}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => setShowDayModal(false)} style={styles.closeButton}>
              <Text style={{ color: '#FFF' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navText: { fontSize: 24, padding: 10 },
  monthText: { fontSize: 20, fontWeight: '300' },
  calendar: { backgroundColor: '#FFF', borderRadius: 8, padding: 10, shadowOpacity: 0.1, elevation: 3 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  dayName: { fontWeight: 'bold', width: 40, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', height: 50, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  dayText: { color: '#555' },
  footer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  checkInButton: { width: 150, height: 150, borderRadius: 75, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: 'red', shadowOpacity: 0.4, shadowRadius: 10 },
  checkInButtonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  checkedInText: { fontSize: 18, color: 'gray', fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 10, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, borderBottomWidth: 1, paddingBottom: 10 },
  noData: { textAlign: 'center', color: '#888', marginVertical: 20 },
  medCard: { padding: 10, backgroundColor: '#fff', borderLeftWidth: 4, borderRadius: 4, marginBottom: 10, shadowOpacity: 0.05, elevation: 1 },
  medName: { fontWeight: 'bold' },
  medTime: { color: '#666', fontSize: 12 },
  closeButton: { backgroundColor: '#333', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 15 }
});

export default DashboardScreen;