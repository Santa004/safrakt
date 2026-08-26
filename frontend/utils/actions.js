import { Linking, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { clinic } from '../data/clinic';

export async function callClinic() {
  try {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  } catch (_) {}
  const url = `tel:${clinic.phoneTel}`;
  Linking.openURL(url).catch(() => {});
}

export function smsClinic() {
  const url = `sms:${clinic.phoneTel}`;
  Linking.openURL(url).catch(() => {});
}

export function emailClinic(subject = '', body = '') {
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const q = params.length ? `?${params.join('&')}` : '';
  const url = `mailto:${clinic.email}${q}`;
  Linking.openURL(url).catch(() => {});
}

export function openMaps() {
  const query = encodeURIComponent(
    `${clinic.address.street}, ${clinic.address.zip} ${clinic.address.city}`
  );
  let url;
  if (Platform.OS === 'ios') {
    url = `maps://?q=${query}`;
  } else if (Platform.OS === 'android') {
    url = `geo:0,0?q=${query}`;
  } else {
    url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
  Linking.openURL(url).catch(() =>
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`)
  );
}

export function openUrl(url) {
  Linking.openURL(url).catch(() => {});
}
