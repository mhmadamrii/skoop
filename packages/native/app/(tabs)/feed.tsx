import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type ListRenderItem,
  type ViewToken,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';

import { FeedCell } from '@/components/feed-cell';
import { type Lesson } from '@/lib/lessons';
import { trpc } from '@/utils/trpc';

const SAFFRON = '#e89638';
const BRIGHT_SMOKE = '#b8ae9d';

export default function Feed() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { height: WIN_H } = useWindowDimensions();
  const cellHeight = Platform.OS === 'ios' ? WIN_H - tabBarHeight : WIN_H;

  const [activeIndex, setActiveIndex] = useState(0);

  const query = useInfiniteQuery(
    trpc.lesson.feed.infiniteQueryOptions(
      { limit: 6 },
      {
        getNextPageParam: (last) => last.nextCursor ?? undefined,
      },
    ),
  );

  const data = useMemo<Lesson[]>(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap((page) =>
      page.items.map((it, idx) => ({
        id: it.id,
        title: it.title,
        description: it.description,
        duration: it.duration,
        videoUrl: it.videoUrl,
        thumbUrl: it.thumbUrl,
        creator: it.creator,
        category: it.category,
        counts: it.counts,
        bgIndex: idx % 3,
      })),
    );
  }, [query.data]);

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first && typeof first.index === 'number') {
        setActiveIndex(first.index);
      }
    },
  ).current;

  const renderItem: ListRenderItem<Lesson> = useCallback(
    ({ item, index }) => (
      <FeedCell
        lesson={item}
        height={cellHeight}
        topInset={insets.top}
        isActive={index === activeIndex}
      />
    ),
    [cellHeight, insets.top, activeIndex],
  );

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />
      {query.isPending ? (
        <CenterState>
          <ActivityIndicator color={SAFFRON} />
        </CenterState>
      ) : query.isError ? (
        <CenterState>
          <Ionicons
            name='cloud-offline-outline'
            size={36}
            color={BRIGHT_SMOKE}
          />
          <Text className='mt-3 font-sans text-base font-semibold text-cream-lantern'>
            Gagal memuat feed.
          </Text>
          <Text className='mt-1 text-center font-sans text-sm text-bright-smoke'>
            Cek koneksi kamu lalu coba lagi.
          </Text>
          <Pressable
            onPress={() => query.refetch()}
            className='mt-5 h-12 items-center justify-center rounded-2xl bg-saffron-500 px-6'
          >
            <Text className='font-sans text-sm font-semibold text-charcoal-warung'>
              Coba lagi
            </Text>
          </Pressable>
        </CenterState>
      ) : data.length === 0 ? (
        <CenterState>
          <View className='h-14 w-14 items-center justify-center rounded-full bg-saffron-500/15'>
            <Ionicons name='videocam-outline' size={26} color={SAFFRON} />
          </View>
          <Text className='mt-4 font-sans text-base font-semibold text-cream-lantern'>
            Belum ada pelajaran.
          </Text>
          <Text className='mt-1 max-w-[280px] text-center font-sans text-sm text-bright-smoke'>
            Unggah pelajaran pertamamu untuk mulai mengisi feed Skoop.
          </Text>
        </CenterState>
      ) : (
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
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          refreshing={query.isRefetching}
          onRefresh={() => query.refetch()}
        />
      )}
    </View>
  );
}

function CenterState({ children }: { children: React.ReactNode }) {
  return (
    <View className='flex-1 items-center justify-center px-8'>{children}</View>
  );
}
