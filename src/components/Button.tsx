import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { colors } from '../styles/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
}: Props) {
  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.secondary,
    variant === 'danger' && styles.danger,
    disabled && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    variant === 'secondary' && styles.textSecondary,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },

  danger: {
    backgroundColor: colors.danger,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  textSecondary: {
    color: colors.primary,
  },
});
