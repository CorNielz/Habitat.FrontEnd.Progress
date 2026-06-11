import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';

export function EditProfileScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const updatePassword = useAuthStore((state) => state.updatePassword);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleSaveProfile() {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Nome e email são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({ name: name.trim() });
      Alert.alert('Sucesso', 'Perfil atualizado');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Atenção', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setPasswordLoading(true);
      await updatePassword(currentPassword, newPassword);
      Alert.alert('Sucesso', 'Senha alterada com sucesso');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao alterar senha');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>Editar perfil</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        <Input
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false}
        />

        <Text style={styles.helperText}>
          O e-mail é exibido apenas para referência e não pode ser alterado nesta versão.
        </Text>

        <Button
          title="Salvar alterações"
          onPress={handleSaveProfile}
          loading={loading}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alterar senha</Text>

        <Input
          placeholder="Senha atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <Input
          placeholder="Nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <Button
          title="Alterar senha"
          onPress={handleChangePassword}
          loading={passwordLoading}
          variant="secondary"
        />
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
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  topTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: -8,
  },
});
