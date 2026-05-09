import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { haptics } from '@/utils/haptics';

type Category = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const CATEGORIES: Category[] = [
  { id: 'sains', label: 'Sains', icon: 'flask' },
  { id: 'sejarah', label: 'Sejarah', icon: 'hourglass' },
  { id: 'koding', label: 'Koding', icon: 'code-slash' },
  { id: 'finansial', label: 'Finansial', icon: 'cash' },
  { id: 'bahasa', label: 'Bahasa', icon: 'language' },
  { id: 'seni', label: 'Seni', icon: 'color-palette' },
  { id: 'kesehatan', label: 'Kesehatan', icon: 'fitness' },
  { id: 'bisnis', label: 'Bisnis', icon: 'briefcase' },
];

const MIN_PICK = 3;

export default function Onboarding() {
  const router = useRouter();
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    haptics.selection();
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canContinue = picked.size >= MIN_PICK;

  const advance = () => {
    haptics.light();
    if (!canContinue) return;
    router.replace('/(publics)/auth');
  };

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className='font-sans text-3xl font-bold leading-tight text-cream-lantern'>
            Pilih topik favoritmu
          </Text>
          <Text className='mt-2 font-sans text-sm text-bright-smoke'>
            Minimal {MIN_PICK} — biar feed langsung pintar.
          </Text>

          <View className='mt-6 flex-row flex-wrap gap-3'>
            {CATEGORIES.map((c) => {
              const isPicked = picked.has(c.id);
              return (
                <Pressable
                  key={c.id}
                  onPress={() => toggle(c.id)}
                  style={({ pressed }) => ({
                    width: '48%',
                    opacity: pressed ? 0.85 : 1,
                  })}
                  className={
                    'h-28 justify-between rounded-2xl border p-4 ' +
                    (isPicked
                      ? 'border-saffron-500 bg-saffron-500/10'
                      : 'border-transparent bg-charcoal-warung-raised')
                  }
                >
                  <Ionicons
                    name={c.icon}
                    size={28}
                    color={isPicked ? '#E89638' : '#B8AE9D'}
                  />
                  <Text className='font-sans text-base font-semibold text-cream-lantern'>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']}>
        <View className='px-8 pb-2 pt-3'>
          <Pressable
            disabled={!canContinue}
            onPress={advance}
            style={({ pressed }) => ({
              opacity: !canContinue ? 0.5 : pressed ? 0.85 : 1,
            })}
            className='h-14 items-center justify-center rounded-2xl bg-saffron-500'
          >
            <Text className='font-sans text-lg font-semibold text-charcoal-warung'>
              Lanjut ({picked.size}/{MIN_PICK})
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
