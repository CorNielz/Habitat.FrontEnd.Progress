import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitsStore } from '../store/useHabitsStore';
import { useNotesStore } from '../store/useNotesStore';
import { WEEKDAY_LABELS } from '../types/habit';
import { useMemo } from 'react';

export function HomeScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  const habits = useHabitsStore((s) => s.habits);
  const notes = useNotesStore((s) => s.notes);

  function localIso(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  const today = localIso(new Date());
  const completedToday = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const totalHabits = habits.length;
  const streak = habits.reduce((max, h) => {
    let count = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (h.completedDates.includes(dateStr)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return Math.max(max, count);
  }, 0);

  // Calendar state
  const [currentMonth, setCurrentMonth] = React.useState(() => new Date());
  const [selectedDate, setSelectedDate] = React.useState<string>(today);
  const [modalVisible, setModalVisible] = React.useState(false);

  function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function daysInMonth(d: Date) {
    const start = startOfMonth(d);
    const next = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const days = [] as Date[];
    for (let x = new Date(start); x < next; x.setDate(x.getDate() + 1)) {
      days.push(new Date(x));
    }
    return days;
  }

  function isoDate(d: Date) {
    return localIso(d);
  }

  function parseIsoToLocalDate(iso: string) {
    const parts = iso.split('-');
    if (parts.length !== 3) return new Date(iso);
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const dd = parseInt(parts[2], 10);
    return new Date(y, m, dd);
  }

  function parseCreatedDate(value: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(value);
  }

  function isHabitDueOn(habit: any, date: Date) {
    const created = parseCreatedDate(habit.createdAt);
    const dayOfWeek = date.getDay();
    if (Number.isNaN(created.getTime())) return false;
    if (isoDate(date) < isoDate(created)) return false;

    switch (habit.frequency) {
      case 'single':
        return isoDate(created) === isoDate(date);
      case 'daily':
        return true;
      case 'weekly':
        return created.getDay() === dayOfWeek;
      case 'monthly': {
        const createdDay = created.getDate();
        const daysInThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const expectedDay = Math.min(createdDay, daysInThisMonth);
        return date.getDate() === expectedDay;
      }
      case 'custom':
        return habit.customDays?.includes(dayOfWeek) ?? false;
      default:
        return false;
    }
  }

  const monthDays = useMemo(() => daysInMonth(currentMonth), [currentMonth]);

  const notesByDate = notes.reduce<Record<string, any[]>>((acc, n) => {
    let iso = n.linkedDate;
    if (!iso && n.createdAt) {
      // createdAt may be in pt-BR (dd/mm/yyyy) or an ISO/T string
      const ca = n.createdAt;
      if (ca.includes('/')) {
        // dd/mm/yyyy -> yyyy-mm-dd
        const parts = ca.split('/');
        if (parts.length >= 3) {
          const dd = parts[0].padStart(2, '0');
          const mm = parts[1].padStart(2, '0');
          const yyyy = parts[2];
          iso = `${yyyy}-${mm}-${dd}`;
        }
      } else if (ca.includes('T')) {
        iso = ca.split('T')[0];
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(ca)) {
        iso = ca;
      }
    }
    if (!iso) return acc;
    acc[iso] = acc[iso] || [];
    acc[iso].push(n);
    return acc;
  }, {});

  const habitsByDate = monthDays.reduce<Record<string, any[]>>((acc, d) => {
    const iso = isoDate(d);
    acc[iso] = habits.filter((h) => isHabitDueOn(h, d));
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.cards}>
        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={32} color={colors.primary} />
          <Text style={styles.cardNumber}>{completedToday}/{totalHabits}</Text>
          <Text style={styles.cardLabel}>Hábitos hoje</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="flame" size={32} color="#FF6B35" />
          <Text style={styles.cardNumber}>{streak}</Text>
          <Text style={styles.cardLabel}>Sequência</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="document-text" size={32} color={colors.primary} />
          <Text style={styles.cardNumber}>{notes.length}</Text>
          <Text style={styles.cardLabel}>Anotações</Text>
        </View>
      </View>

      {totalHabits === 0 && notes.length === 0 && (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={64} color={colors.border} />
          <Text style={styles.emptyTitle}>Comece sua jornada</Text>
          <Text style={styles.emptyText}>
            Crie hábitos e anotações para acompanhar seu progresso
          </Text>
        </View>
      )}

      {/* Calendar */}
      <View style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontWeight: '700', color: colors.text }}>
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          {WEEKDAY_LABELS.map((w) => (
            <Text key={w} style={{ width: 32, textAlign: 'center', color: colors.textSecondary }}>{w}</Text>
          ))}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {monthDays.map((d) => {
            const iso = isoDate(d);
            const hasNotes = (notesByDate[iso] || []).length > 0;
            const dueHabits = habitsByDate[iso] || [];
            const repeatingHabits = dueHabits.filter((h: any) => h.frequency !== 'single').length;
            const singleHabits = dueHabits.filter((h: any) => h.frequency === 'single').length;

            return (
              <TouchableOpacity
                key={iso}
                onPress={() => { setSelectedDate(iso); setModalVisible(true); }}
                style={{ width: `${100 / 7}%`, padding: 6, alignItems: 'center' }}
              >
                <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: iso === selectedDate ? '#E8F5E9' : 'transparent' }}>
                  <Text style={{ color: colors.text }}>{d.getDate()}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 4, gap: 4 }}>
                  {hasNotes && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />}
                  {repeatingHabits > 0 && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF6B35' }} />}
                  {singleHabits > 0 && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#9AA39A' }} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected day modal (opened when a day is pressed) */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Eventos em {parseIsoToLocalDate(selectedDate).toLocaleDateString('pt-BR')}</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </Pressable>
              </View>

              <ScrollView>
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>Anotações</Text>
                  {(notesByDate[selectedDate] || []).length === 0 && (
                    <Text style={{ color: colors.textSecondary }}>Nenhuma anotação vinculada a este dia.</Text>
                  )}
                  {(notesByDate[selectedDate] || []).map((n: any) => (
                    <TouchableOpacity
                      key={n.id}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.getParent()?.navigate('EditNote', { note: n });
                      }}
                      style={styles.eventItem}
                    >
                      <Text style={{ fontWeight: '600' }}>{n.title}</Text>
                      <Text numberOfLines={1} style={{ color: colors.textSecondary }}>{n.content}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ marginTop: 12 }}>
                  <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>Hábitos</Text>
                  {(habitsByDate[selectedDate] || []).length === 0 && (
                    <Text style={{ color: colors.textSecondary }}>Nenhum hábito vinculado a este dia.</Text>
                  )}
                  {(habitsByDate[selectedDate] || []).map((h: any) => (
                    <TouchableOpacity
                      key={h.id}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.getParent()?.navigate('EditHabit', { habit: h });
                      }}
                      style={styles.eventItem}
                    >
                      <Text style={{ fontWeight: '600' }}>{h.title} {h.frequency !== 'single' ? '(repetitivo)' : ''}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 72,
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },

  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },

  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textTransform: 'capitalize',
  },

  cards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },

  card: {
    flex: 1,
    backgroundColor: '#F7F9F7',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },

  cardNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },

  cardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },

  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  eventItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F1',
  },
});
