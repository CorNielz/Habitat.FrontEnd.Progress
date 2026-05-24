import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
} from 'react-native';

import { colors } from '../styles/colors';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
}

export function Input(props: Props) {
    return (
        <View style={styles.container}>
            <TextInput
                placeholderTextColor="#8A8A8A"
                style={styles.input}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
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
});
