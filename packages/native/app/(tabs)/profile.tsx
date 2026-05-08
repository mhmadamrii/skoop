import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

const AVATAR = require('../../assets/images/placeholder.png');
const THUMB = require('../../assets/images/placeholder.png');

type ProfileTab = 'created' | 'liked';

const CREATED_IDS = Array.from({ length: 12 }, (_, i) => `c-${i}`);
const LIKED_IDS = Array.from({ length: 9 }, (_, i) => `l-${i}`);

export default function Profile() {
  const [tab, setTab] = useState<ProfileTab>('created');
  const items = tab === 'created' ? CREATED_IDS : LIKED_IDS;
  const { width: WIN_W } = useWindowDimensions();
  const gridSize = (WIN_W - 48 - 4) / 3;

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-row justify-end px-6 pt-2'>
            <Pressable hitSlop={8}>
              <Ionicons name='settings-outline' size={24} color='#FAF6EE' />
            </Pressable>
          </View>

          <View className='items-center px-6 pt-2'>
            <Image
              source={AVATAR}
              style={{ width: 96, height: 96, borderRadius: 48 }}
              contentFit='cover'
            />
            <Text className='mt-4 font-sans text-2xl font-bold text-cream-lantern'>
              Adi P.
            </Text>
            <Text className='mt-1 font-sans text-base text-bright-smoke'>
              @adipratama
            </Text>
          </View>

          <View className='mt-6 flex-row px-6'>
            <Stat n='12' label='MENGIKUTI' />
            <Stat n='4' label='PENGIKUT' />
            <Stat n='27' label='PELAJARAN' />
          </View>

          <View className='mt-6 px-6'>
            <Pressable
              onPress={() => router.push('/(publics)')}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              className='h-14 items-center justify-center rounded-2xl bg-saffron-500'
            >
              <Text className='font-sans text-lg font-semibold text-charcoal-warung'>
                Edit profil
              </Text>
            </Pressable>
          </View>

          <View className='mt-8 flex-row gap-8 px-6'>
            <TabUnderline
              label='Dibuat'
              active={tab === 'created'}
              onPress={() => setTab('created')}
            />
            <TabUnderline
              label='Disukai'
              active={tab === 'liked'}
              onPress={() => setTab('liked')}
            />
          </View>

          {items.length === 0 ? (
            <View className='items-center px-6 py-16'>
              <Text className='font-sans text-sm text-bright-smoke'>
                Belum ada{' '}
                {tab === 'created'
                  ? 'pelajaran yang dibuat'
                  : 'pelajaran yang disukai'}
                .
              </Text>
            </View>
          ) : (
            <View className='mt-2 flex-row flex-wrap gap-0.5 px-6'>
              {items.map((id) => (
                <Pressable
                  key={id}
                  style={({ pressed }) => ({
                    width: gridSize,
                    height: gridSize,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Image
                    source={THUMB}
                    style={{
                      width: gridSize,
                      height: gridSize,
                      borderRadius: 6,
                    }}
                    contentFit='cover'
                  />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <View className='flex-1 items-center'>
      <Text className='font-sans text-xl font-bold text-cream-lantern'>
        {n}
      </Text>
      <Text className='mt-0.5 font-sans text-xs font-medium tracking-wider text-bright-smoke'>
        {label}
      </Text>
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
