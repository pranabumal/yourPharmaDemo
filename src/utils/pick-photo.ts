import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

async function fromCamera(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Camera access needed', 'Allow camera access in Settings to take a photo.');
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
  return result.canceled ? null : result.assets[0].uri;
}

async function fromLibrary(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
  return result.canceled ? null : result.assets[0].uri;
}

/** Asks "Take photo" or "Choose from library", then returns the picked image URI. */
export function pickPhoto(onPicked: (uri: string) => void) {
  const handle = (source: () => Promise<string | null>) => async () => {
    const uri = await source();
    if (uri) onPicked(uri);
  };
  Alert.alert('Attach a photo', 'e.g. a prescription label or insurance card', [
    { text: 'Take photo', onPress: handle(fromCamera) },
    { text: 'Choose from library', onPress: handle(fromLibrary) },
    { text: 'Cancel', style: 'cancel' },
  ]);
}
