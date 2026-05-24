import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@habitat_notes';

export async function saveNotes(notes: any[]) {
    await AsyncStorage.setItem(
        NOTES_KEY,
        JSON.stringify(notes)
    );
}

export async function getNotes() {
    const response = await AsyncStorage.getItem(NOTES_KEY);

    if (!response) {
        return [];
    }

    return JSON.parse(response);
}