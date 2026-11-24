import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) });

/** Local-only daily reminder. Nothing leaves the device. Returns false if permission was denied. */
export async function scheduleDailyReminder(hour: number, minute: number): Promise<boolean> {
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('reminders', { name: 'Daily reminder', importance: Notifications.AndroidImportance.DEFAULT });
  const cur = await Notifications.getPermissionsAsync();
  const perm = cur.granted ? cur : await Notifications.requestPermissionsAsync();
  if (!perm.granted) return false;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Time for your BrainRush', body: 'Keep your streak alive with a quick brain workout.' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: 'reminders' },
  });
  return true;
}
export const cancelReminder = () => Notifications.cancelAllScheduledNotificationsAsync();
