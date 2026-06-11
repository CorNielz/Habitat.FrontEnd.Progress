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

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Comece a construir seus hábitos</Text>

      <View style={styles.form}>
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
        />

        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Cadastrar"
          onPress={handleRegister}
          loading={loading}
        />

        <Button
          title="Já tenho conta"
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
    marginBottom: 32,
  },

  form: {
    gap: 16,
  },
});
