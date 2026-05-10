import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { CATEGORIES } from '@/lib/categories';

const AVATAR = require('../../assets/images/placeholder.png');

type Creator = {
  id: string;
  handle: string;
  followers: string;
};

const TRENDING: Creator[] = [
  { id: '1', handle: '@maya.sains', followers: '24.1K' },
  { id: '2', handle: '@budi.duit', followers: '18.7K' },
  { id: '3', handle: '@rizki.history', followers: '32.4K' },
  { id: '4', handle: '@dev.indo', followers: '11.2K' },
  { id: '5', handle: '@bahasa.cepat', followers: '8.9K' },
  { id: '6', handle: '@seni.studio', followers: '6.1K' },
];

export default function Discover() {
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
          <View className='flex-row items-center gap-2 rounded-2xl bg-charcoal-warung-raised px-4 py-3'>
            <Ionicons name='search' size={20} color='#B8AE9D' />
            <TextInput
              placeholder='Cari pelajaran, kreator, topik...'
              placeholderTextColor='#B8AE9D'
              returnKeyType='search'
              className='flex-1 font-sans text-base text-cream-lantern'
            />
          </View>

          <Text className='mt-8 font-sans text-2xl font-bold text-cream-lantern'>
            Topik
          </Text>
          <View className='mt-4 flex-row flex-wrap gap-3'>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                style={({ pressed }) => ({
                  width: '48%',
                  opacity: pressed ? 0.85 : 1,
                })}
                className='h-28 justify-between rounded-2xl bg-charcoal-warung-raised p-4'
                onPress={() =>
                  router.push({
                    pathname: '/(screens)/(scroll)/[topicId]',
                    params: { topicId: c.id },
                  })
                }
              >
                <Ionicons name={c.icon} size={28} color='#E89638' />
                <Text className='font-sans text-base font-semibold text-cream-lantern'>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className='mt-8 font-sans text-2xl font-bold text-cream-lantern'>
            Kreator yang lagi naik
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -24 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 16,
              gap: 16,
            }}
          >
            {TRENDING.map((c) => (
              <View key={c.id} className='w-32 items-center'>
                <Image
                  source={AVATAR}
                  style={{ width: 64, height: 64, borderRadius: 32 }}
                  contentFit='cover'
                />
                <Text
                  className='mt-2 font-sans text-sm font-semibold text-cream-lantern'
                  numberOfLines={1}
                >
                  {c.handle}
                </Text>
                <Text className='font-sans text-xs text-bright-smoke'>
                  {c.followers} pengikut
                </Text>
                <Pressable
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                  className='mt-2 rounded-full bg-saffron-500 px-4 py-1.5'
                >
                  <Text className='font-sans text-xs font-semibold text-charcoal-warung'>
                    Ikuti
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
