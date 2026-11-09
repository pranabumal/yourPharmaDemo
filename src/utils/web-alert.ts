import { Alert, Platform, type AlertButton } from 'react-native';

/**
 * React Native's Alert does nothing in a web browser. On web, show the
 * browser's own dialogs instead, so confirm prompts still work.
 */
if (Platform.OS === 'web') {
  Alert.alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    const text = [title, message].filter(Boolean).join('\n\n');
    const cancel = buttons?.find((b) => b.style === 'cancel');
    const actions = (buttons ?? []).filter((b) => b.style !== 'cancel');

    if (actions.length === 0) {
      window.alert(text);
      cancel?.onPress?.();
    } else if (actions.length === 1 && !cancel) {
      window.alert(text);
      actions[0].onPress?.();
    } else if (window.confirm(text)) {
      actions[0].onPress?.();
    } else {
      cancel?.onPress?.();
    }
  };
}
