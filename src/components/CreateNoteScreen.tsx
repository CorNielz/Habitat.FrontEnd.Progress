import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { colors } from '../styles/colors';
import { useNotesStore } from '../store/useNotesStore';

export function CreateNoteScreen({ navigation }: any) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const addNote = useNotesStore((state) => state.addNote);

    function handleSave() {
        addNote({
            id: String(Date.now()),
            title,
            content,
            createdAt: new Date().toLocaleDateString(),
            favorite: false,
        });

        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Título"
                placeholderTextColor="#999"
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                placeholder="Comece a escrever..."
                placeholderTextColor="#999"
                multiline
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSave}
            >
                <Text style={styles.buttonText}>
                    Salvar nota
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 72,
        paddingHorizontal: 24,
    },

    titleInput: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 24,
    },

    contentInput: {
        flex: 1,
        fontSize: 16,
        lineHeight: 28,
        color: colors.text,
        textAlignVertical: 'top',
    },

    button: {
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 32,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
