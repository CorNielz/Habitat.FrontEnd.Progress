import '@testing-library/jest-native/extend-expect';

// enable fetch mocks
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

// mock AsyncStorage for tests
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
