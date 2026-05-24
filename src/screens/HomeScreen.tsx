import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,

} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { NoteCard } from '../components/NoteCard';
import { useNotesStore } from '../store/useNotesStore';

export function HomeScreen({ navigation }: any) {
    const notes = useNotesStore((state) => state.notes);
    const loaded = useNotesStore((state) => state.loaded);
    const toggleFavorite = useNotesStore((state) => state.toggleFavorite);
    const loadNotes = useNotesStore((state) => state.loadNotes);

    React.useEffect(() => {
        loadNotes();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Habitat</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateNote')}
                >
                    <Ionicons
                        name="add-circle"
                        size={32}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>

            {!loaded ? (
                <View style={styles.empty}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : notes.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons
                        name="leaf-outline"
                        size={64}
                        color={colors.border}
                    />
                    <Text style={styles.emptyText}>
                        Nenhuma nota ainda
                    </Text>
                    <Text style={styles.emptySubtext}>
                        Toque no + para criar sua primeira nota
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => (
                        <NoteCard
                            note={item}
                            onPress={() => navigation.navigate('Note', { note: item })}
                            onFavorite={() => toggleFavorite(item.id)}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 72,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },

    title: {
        fontSize: 34,
        fontWeight: '700',
        color: colors.text,
    },

    list: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    separator: {
        height: 16,
    },

    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    },

    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: 16,
    },

    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 8,
    },
});
