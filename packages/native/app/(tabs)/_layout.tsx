import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { haptics } from '../../utils/haptics';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type TabConfig = {
  active: IoniconsName;
  inactive: IoniconsName;
  label: string;
};

const TABS: Record<string, TabConfig> = {
  feed: {
    active: 'home',
    inactive: 'home-outline',
    label: 'Feed',
  },
  discover: {
    active: 'compass',
    inactive: 'compass-outline',
    label: 'Cari',
  },
  upload: {
    active: 'add',
    inactive: 'add',
    label: '',
  },
  library: {
    active: 'bookmark',
    inactive: 'bookmark-outline',
    label: 'Library',
  },
  profile: {
    active: 'person',
    inactive: 'person-outline',
    label: 'Kamu',
  },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#0E0B08' }}>
      <View className='flex-row items-center justify-between border-t border-dim-smoke px-4 pb-1 pt-2'>
        {state.routes.map((route, i) => {
          const cfg = TABS[route.name];
          if (!cfg) return null;

          const focused = state.index === i;
          const isUpload = route.name === 'upload';

          const onPress = () => {
            haptics.light();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          if (isUpload) {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                className='h-11 w-11 items-center justify-center rounded-xl bg-saffron-500'
              >
                <Ionicons name='add' size={26} color='#14110D' />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              hitSlop={8}
              className='flex-1 items-center justify-center py-1'
            >
              <Ionicons
                name={focused ? cfg.active : cfg.inactive}
                size={24}
                color={focused ? '#E89638' : '#B8AE9D'}
              />
              <Text
                className='mt-0.5 font-sans text-xs font-medium'
                style={{ color: focused ? '#E89638' : '#B8AE9D' }}
              >
                {cfg.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name='feed' />
      <Tabs.Screen name='discover' />
      <Tabs.Screen name='upload' />
      <Tabs.Screen name='library' />
      <Tabs.Screen name='profile' />
    </Tabs>
  );
}
