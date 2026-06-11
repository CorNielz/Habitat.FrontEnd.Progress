import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';

export function ProfileScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        {user?.role === 'admin' && (
          <View style={styles.adminBadge}>
            <Ionicons name="shield" size={12} color="#FFFFFF" />
            <Text style={styles.adminText}>Administrador</Text>
          </View>
        )}
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="person-outline" size={22} color={colors.text} />
          <Text style={styles.menuText}>Editar perfil</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.border} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={22} color={colors.text} />
          <Text style={styles.menuText}>Configurações</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.border} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={[styles.menuText, { color: colors.danger }]}>Sair</Text>
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

  header: {
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },

  adminText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  menu: {
    paddingHorizontal: 24,
    gap: 4,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});
