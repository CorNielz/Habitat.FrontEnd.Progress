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

export function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.trim());
      Alert.alert('Sucesso', 'Instruções enviadas para seu e-mail', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'E-mail não encontrado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <Text style={styles.subtitle}>
        Informe seu e-mail e enviaremos instruções para redefinir sua senha
      </Text>

      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Enviar instruções"
          onPress={handleReset}
          loading={loading}
        />

        <Button
          title="Voltar ao login"
          onPress={() => navigation.goBack()}
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },

  form: {
    gap: 16,
  },
});
