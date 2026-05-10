import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const THUMB = require('../../assets/images/placeholder.png');

type LibraryTab = 'saved' | 'history';

type Lesson = {
  id: string;
  title: string;
  creator: string;
  category: string;
};

const SAVED: Lesson[] = [
  {
    id: 's1',
    title: 'Kenapa langit jadi merah saat senja?',
    creator: '@maya.sains',
    category: 'Sains',
  },
  {
    id: 's2',
    title: 'Cara kerja inflasi, dalam 60 detik.',
    creator: '@budi.duit',
    category: 'Finansial',
  },
  {
    id: 's3',
    title: 'Kenapa Borobudur dibangun setinggi itu?',
    creator: '@rizki.history',
    category: 'Sejarah',
  },
  {
    id: 's4',
    title: 'Apa itu hash table, tanpa jargon.',
    creator: '@dev.indo',
    category: 'Koding',
  },
  {
    id: 's5',
    title: 'Kenapa "kau" dan "kamu" beda rasa?',
    creator: '@bahasa.cepat',
    category: 'Bahasa',
  },
];

const HISTORY: Lesson[] = [
  {
    id: 'h1',
    title: 'Mengapa kita lupa nama orang?',
    creator: '@maya.sains',
    category: 'Sains',
  },
  {
    id: 'h2',
    title: 'Riba vs bunga bank, beda atau sama?',
    creator: '@budi.duit',
    category: 'Finansial',
  },
  {
    id: 'h3',
    title: 'Cara Soekarno baca pidato tanpa teks.',
    creator: '@rizki.history',
    category: 'Sejarah',
  },
];

export default function Library() {
  const [tab, setTab] = useState<LibraryTab>('saved');
  const items = tab === 'saved' ? SAVED : HISTORY;

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
          <Text className='font-sans text-3xl font-bold text-cream-lantern'>
            Library
          </Text>
          <Text className='mt-1 font-sans text-sm text-bright-smoke'>
            Pelajaran kamu, balik kapan saja.
          </Text>

          <View className='mt-6 flex-row items-center gap-4 rounded-2xl bg-charcoal-warung-raised p-4'>
            <View className='h-12 w-12 items-center justify-center rounded-full bg-saffron-500/15'>
              <Ionicons name='flame' size={24} color='#E89638' />
            </View>
            <View className='flex-1'>
              <Text className='font-sans text-lg font-bold text-cream-lantern'>
                5 hari berturut-turut
              </Text>
              <Text className='mt-0.5 font-sans text-xs text-bright-smoke'>
                Streak terpanjang: 12 hari.
              </Text>
            </View>
          </View>

          <View className='mt-8 flex-row gap-6'>
            <TabUnderline
              label='Disimpan'
              active={tab === 'saved'}
              onPress={() => setTab('saved')}
            />
            <TabUnderline
              label='Riwayat'
              active={tab === 'history'}
              onPress={() => setTab('history')}
            />
          </View>

          <View className='mt-2'>
            {items.length === 0 ? (
              <View className='items-center py-16'>
                <Text className='font-sans text-sm text-bright-smoke'>
                  Belum ada{' '}
                  {tab === 'saved' ? 'pelajaran tersimpan' : 'riwayat tontonan'}
                  .
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                  className='flex-row gap-3 py-3'
                >
                  <Image
                    source={THUMB}
                    style={{ width: 56, height: 72, borderRadius: 12 }}
                    contentFit='cover'
                  />
                  <View className='flex-1 justify-between py-1'>
                    <Text
                      className='font-sans text-base font-semibold text-cream-lantern'
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <View className='flex-row items-center gap-2'>
                      <Text className='font-sans text-xs text-bright-smoke'>
                        {item.creator}
                      </Text>
                      <View className='rounded-full bg-saffron-100 px-2 py-0.5'>
                        <Text className='font-sans text-xs font-semibold text-saffron-700'>
                          {item.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

type TabUnderlineProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function TabUnderline({ label, active, onPress }: TabUnderlineProps) {
  return (
    <Pressable onPress={onPress} hitSlop={8} className='items-center pb-3'>
      <Text
        className={
          'font-sans text-base font-semibold ' +
          (active ? 'text-cream-lantern' : 'text-bright-smoke')
        }
      >
        {label}
      </Text>
      {active && (
        <View className='absolute bottom-0 left-0 right-0 h-0.5 bg-saffron-500' />
      )}
    </Pressable>
  );
}
