import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
} from 'react-native';

import { colors } from '../styles/colors';

interface Props extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  label?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  multiline,
  label,
  ...rest
}: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor="#8A8A8A"
        style={[styles.input, error && styles.inputError, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : undefined}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginLeft: 4,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },

  inputError: {
    borderColor: colors.danger,
  },

  multiline: {
    minHeight: 120,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 18,
  },
});
