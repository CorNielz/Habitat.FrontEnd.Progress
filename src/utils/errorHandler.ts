import { Alert } from 'react-native';

export function getFriendlyMessage(err: any, fallback = 'Ocorreu um erro') {
  if (!err) return fallback;

  // Api ProblemDetails
  if (err.data && typeof err.data === 'object') {
    if (err.data.detail) return err.data.detail;
    if (err.detail) return err.detail;
    if (err.data.title) return err.data.title;
  }

  if (err.message) return err.message;
  if (typeof err === 'string') return err;

  return fallback;
}

export function showApiError(err: any, title = 'Erro') {
  const msg = getFriendlyMessage(err, 'Falha na requisição');
  try {
    Alert.alert(title, msg);
  } catch (e) {
    // noop
    // In non-RN environments, fallback to console
    // eslint-disable-next-line no-console
    console.warn(title, msg);
  }
}
