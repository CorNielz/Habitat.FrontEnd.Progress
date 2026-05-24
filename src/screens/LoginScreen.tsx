import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { login } from '../services/auth';
import { colors } from '../styles/colors';

export function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        try {
            setLoading(true);
            await login(email, password);
            navigation.replace('Main');
        } catch (error) {
            // handled by auth service
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.title}>Habitat</Text>

                <Text style={styles.subtitle}>
                    Organize ideias de forma natural
                </Text>
            </View>

            <View style={styles.form}>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
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

                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.link}>
                        Criar conta
                    </Text>
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

    link: {
        textAlign: 'center',
        marginTop: 16,
        color: colors.primary,
        fontWeight: '600',
    },
});
