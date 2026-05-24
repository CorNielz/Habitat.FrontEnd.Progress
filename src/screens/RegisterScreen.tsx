import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
} from 'react-native';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { register } from '../services/auth';
import { colors } from '../styles/colors';

export function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        try {
            setLoading(true);

            await register(email, password);

            Alert.alert('Sucesso', 'Conta criada');

            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar conta</Text>

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
                    title="Cadastrar"
                    onPress={handleRegister}
                    loading={loading}
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
        marginBottom: 32,
    },

    form: {
        gap: 16,
    },
});
