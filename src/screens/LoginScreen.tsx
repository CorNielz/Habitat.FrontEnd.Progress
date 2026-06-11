import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Habitat</Text>
        <Text style={styles.subtitle}>
          Organize seus hábitos de forma natural
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
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

  hero: {
    marginBottom: 48,
  },

  title: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  form: {
    gap: 16,
  },

  forgotPassword: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
  },

  link: {
    textAlign: 'center',
    marginTop: 8,
    color: colors.primary,
    fontWeight: '600',
  },
});
