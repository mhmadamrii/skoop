import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const VIDEO_BG = [
  require('../../assets/images/s-1.jpg'),
  require('../../assets/images/s-2.jpg'),
  require('../../assets/images/s-3.jpg'),
];

const AVATAR = require('../../assets/images/placeholder.png');

type Lesson = {
  id: string;
  category: string;
  creator: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  saves: string;
  bgIndex: number;
};

const LESSONS: Omit<Lesson, 'id' | 'bgIndex'>[] = [
  {
    category: 'SAINS',
    creator: '@maya.sains',
    title: 'Kenapa langit jadi merah saat senja?',
    description: 'Cahaya matahari yang dipantulkan partikel atmosfer.',
    likes: '12.4K',
    comments: '284',
    saves: '1.1K',
  },
  {
    category: 'FINANSIAL',
    creator: '@budi.duit',
    title: 'Cara kerja inflasi, dalam 60 detik.',
    description: 'Bukan harga yang naik, tapi nilai uangmu yang turun.',
    likes: '8.9K',
    comments: '152',
    saves: '742',
  },
  {
    category: 'SEJARAH',
    creator: '@rizki.history',
    title: 'Kenapa Borobudur dibangun setinggi itu?',
    description: 'Ada tujuan kosmologis di balik 9 tingkat candi.',
    likes: '21.2K',
    comments: '512',
    saves: '3.4K',
  },
  {
    category: 'KODING',
    creator: '@dev.indo',
    title: 'Apa itu hash table, tanpa jargon.',
    description: 'Bayangin lemari laci raksasa, tiap laci punya label.',
    likes: '5.6K',
    comments: '98',
    saves: '480',
  },
  {
    category: 'BAHASA',
    creator: '@bahasa.cepat',
    title: 'Kenapa "kau" dan "kamu" beda rasa?',
    description: 'Pronoun kedua dalam Bahasa menandai jarak sosial.',
    likes: '3.2K',
    comments: '76',
    saves: '210',
  },
];

function makeBatch(start: number, count: number): Lesson[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = start + i;
    const base = LESSONS[idx % LESSONS.length];
    return {
      ...base,
      id: `lesson-${idx}`,
      bgIndex: idx % VIDEO_BG.length,
    };
  });
}

export default function Feed() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { height: WIN_H } = useWindowDimensions();
  const cellHeight = WIN_H - tabBarHeight;

  const [data, setData] = useState<Lesson[]>(() => makeBatch(0, 6));

  const loadMore = useCallback(() => {
    setData((prev) => [...prev, ...makeBatch(prev.length, 4)]);
  }, []);

  const renderItem: ListRenderItem<Lesson> = useCallback(
    ({ item }) => (
      <FeedCell lesson={item} height={cellHeight} topInset={insets.top} />
    ),
    [cellHeight, insets.top],
  );

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={cellHeight}
        snapToAlignment='start'
        decelerationRate='fast'
        onEndReached={loadMore}
        onEndReachedThreshold={2}
        getItemLayout={(_, index) => ({
          length: cellHeight,
          offset: cellHeight * index,
          index,
        })}
        windowSize={3}
        maxToRenderPerBatch={3}
      />
    </View>
  );
}

type FeedCellProps = {
  lesson: Lesson;
  height: number;
  topInset: number;
};

function FeedCell({ lesson, height, topInset }: FeedCellProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const heartScale = useSharedValue(1);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const onLike = () => {
    setLiked((v) => !v);
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 220 }),
      withSpring(1, { damping: 8, stiffness: 220 }),
    );
  };

  return (
    <View style={{ height }} className='bg-charcoal-warung'>
      <Image
        source={VIDEO_BG[lesson.bgIndex]}
        style={StyleSheet.absoluteFill}
        contentFit='cover'
        transition={200}
      />

      {/* Top scrim — protects category label from bright video. */}
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(20, 17, 13, 0.6)', 'transparent']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: topInset + 96,
        }}
      />

      {/* Bottom scrim — protects creator info and the action rail. */}
      <LinearGradient
        pointerEvents='none'
        colors={['transparent', 'rgba(20, 17, 13, 0.7)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 240,
        }}
      />

      {/* Top: category label */}
      <View
        style={{ paddingTop: topInset + 14 }}
        className='absolute left-0 right-0 top-0 px-5'
      >
        <Text className='font-sans text-xs font-medium tracking-widest text-cream-lantern'>
          {lesson.category}
        </Text>
      </View>

      {/* Bottom-left: creator + title + description */}
      <View className='absolute bottom-6 left-5 right-20'>
        <View className='mb-3 flex-row items-center gap-2'>
          <Image
            source={AVATAR}
            style={{ width: 32, height: 32, borderRadius: 16 }}
            contentFit='cover'
          />
          <Text className='font-sans text-base font-semibold text-cream-lantern'>
            {lesson.creator}
          </Text>
        </View>
        <Text className='font-sans text-2xl font-bold leading-tight text-cream-lantern'>
          {lesson.title}
        </Text>
        <Text className='mt-2 font-sans text-sm leading-relaxed text-cream-lantern'>
          {lesson.description}
        </Text>
      </View>

      {/* Right action rail */}
      <View className='absolute bottom-8 right-3 items-center gap-6'>
        <Pressable onPress={onLike} hitSlop={8} className='items-center'>
          <Animated.View style={heartStyle}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={32}
              color={liked ? '#E89638' : '#FAF6EE'}
            />
          </Animated.View>
          <Text className='mt-1 font-sans text-xs font-medium text-cream-lantern'>
            {lesson.likes}
          </Text>
        </Pressable>

        <Pressable hitSlop={8} className='items-center'>
          <Ionicons name='chatbubble-outline' size={28} color='#FAF6EE' />
          <Text className='mt-1 font-sans text-xs font-medium text-cream-lantern'>
            {lesson.comments}
          </Text>
        </Pressable>

        <Pressable
          hitSlop={8}
          onPress={() => setSaved((v) => !v)}
          className='items-center'
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={saved ? '#E89638' : '#FAF6EE'}
          />
          <Text className='mt-1 font-sans text-xs font-medium text-cream-lantern'>
            {lesson.saves}
          </Text>
        </Pressable>

        <Pressable hitSlop={8} className='items-center'>
          <Ionicons name='paper-plane-outline' size={28} color='#FAF6EE' />
          <Text className='mt-1 font-sans text-xs font-medium text-cream-lantern'>
            Bagikan
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
