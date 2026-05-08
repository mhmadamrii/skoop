import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

type Panel = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
};

const PANELS: Panel[] = [
  {
    icon: 'play-circle',
    title: 'Belajar dalam 90 detik.',
    body: 'Setiap geseran satu pelajaran. Kecil, tajam, gampang diingat.',
  },
  {
    icon: 'flash',
    title: 'Geser, dan makin pintar.',
    body: 'Algoritma kami belajar dari apa yang kamu pelajari — bukan cuma yang kamu tonton.',
  },
  {
    icon: 'compass',
    title: 'Topik kamu, di tangan kamu.',
    body: 'Sains, sejarah, koding, finansial, seni — dari kreator yang bikin belajar terasa seru.',
  },
];

export default function Index() {
  const listRef = useRef<FlatList<Panel>>(null);
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const isLast = index === PANELS.length - 1;

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (next !== index) setIndex(next);
  };

  const advance = () => {
    if (isLast) {
      router.replace('/(publics)/onboarding');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const skip = () => router.replace('/(publics)/auth');

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />

      <SafeAreaView edges={['top']}>
        <View className='flex-row justify-end px-6 pt-2'>
          <Pressable hitSlop={12} onPress={skip}>
            <Text className='font-sans text-base text-bright-smoke'>
              Lewati
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <FlatList
        ref={listRef}
        data={PANELS}
        keyExtractor={(p) => p.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_W }}
            className='flex-1 items-center justify-center px-10'
          >
            <View className='mb-12 h-44 w-44 items-center justify-center rounded-full bg-charcoal-warung-raised'>
              <Ionicons name={item.icon} size={96} color='#E89638' />
            </View>
            <Text className='text-center font-sans text-3xl font-bold leading-tight text-cream-lantern'>
              {item.title}
            </Text>
            <Text className='mt-4 text-center font-sans text-base leading-relaxed text-bright-smoke'>
              {item.body}
            </Text>
          </View>
        )}
      />

      <SafeAreaView edges={['bottom']}>
        <View className='px-8 pb-2'>
          <View className='mb-8 flex-row items-center justify-center gap-2'>
            {PANELS.map((_, i) => (
              <View
                key={i}
                className={
                  i === index
                    ? 'h-2 w-6 rounded-full bg-saffron-500'
                    : 'h-2 w-2 rounded-full bg-dim-smoke'
                }
              />
            ))}
          </View>

          <Pressable
            onPress={advance}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            className='h-14 items-center justify-center rounded-2xl bg-saffron-500'
          >
            <Text className='font-sans text-lg font-semibold text-charcoal-warung'>
              {isLast ? 'Mulai' : 'Lanjut'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
