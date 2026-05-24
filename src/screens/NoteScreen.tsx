import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { useNotesStore } from '../store/useNotesStore';

export function NoteScreen({ route, navigation }: any) {
    const { note } = route.params;
    const removeNote = useNotesStore((state) => state.removeNote);

    function handleDelete() {
        removeNote(note.id);
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={22} color={colors.danger} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
            >
                <Text style={styles.title}>
                    {note.title}
                </Text>

                <Text style={styles.date}>
                    {note.createdAt}
                </Text>

                <Text style={styles.text}>
                    {note.content}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 72,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },

    scroll: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    title: {
        fontSize: 34,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 14,
    },

    date: {
        color: '#9BA59B',
        marginBottom: 32,
    },

    text: {
        fontSize: 17,
        lineHeight: 30,
        color: colors.text,
    },
});
