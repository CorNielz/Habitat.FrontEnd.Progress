import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';

export function SettingsScreen({ navigation }: any) {
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Configurações</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Notificações</Text>
            <Text style={styles.menuValue}>Em breve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="moon-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Tema</Text>
            <Text style={styles.menuValue}>Claro</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>

          <View style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Versão</Text>
            <Text style={styles.menuValue}>1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 8,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },

  menuValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    marginTop: 16,
  },

  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
