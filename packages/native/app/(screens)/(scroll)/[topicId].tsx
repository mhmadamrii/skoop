import { useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FeedCell } from '@/components/feed-cell';
import { findCategory, otherCategories } from '@/lib/categories';
import { makeTopicBatch, type Lesson } from '@/lib/lessons';

type FeedItem =
  | { kind: 'lesson'; lesson: Lesson }
  | { kind: 'end'; topicLabel: string };

export default function TopicScroll() {
  const insets = useSafeAreaInsets();
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const { height: WIN_H } = useWindowDimensions();
  const cellHeight = WIN_H;

  const category = useMemo(() => findCategory(topicId), [topicId]);
  const lessons = useMemo(
    () => (category ? makeTopicBatch(category.id) : []),
    [category],
  );

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/discover');
  };

  if (!category || lessons.length === 0) {
    return (
      <EmptyState
        topicId={topicId}
        topicLabel={category?.label}
        topInset={insets.top}
        onBack={goBack}
      />
    );
  }

  const items: FeedItem[] = [
    ...lessons.map((l) => ({ kind: 'lesson' as const, lesson: l })),
    { kind: 'end' as const, topicLabel: category.label },
  ];

  const renderItem: ListRenderItem<FeedItem> = ({ item }) => {
    if (item.kind === 'lesson') {
      return (
        <FeedCell
          lesson={item.lesson}
          height={cellHeight}
          topInset={insets.top}
          showCategoryLabel={false}
        />
      );
    }
    return (
      <EndCard
        topicLabel={item.topicLabel}
        height={cellHeight}
        topInset={insets.top}
      />
    );
  };

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />
      <FlatList
        data={items}
        keyExtractor={(item) =>
          item.kind === 'lesson' ? item.lesson.id : `end-${item.topicLabel}`
        }
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={cellHeight}
        snapToAlignment='start'
        decelerationRate='fast'
        getItemLayout={(_, index) => ({
          length: cellHeight,
          offset: cellHeight * index,
          index,
        })}
        windowSize={3}
        maxToRenderPerBatch={3}
      />
      <TopicHeader
        label={category.label}
        topInset={insets.top}
        onBack={goBack}
      />
    </View>
  );
}

type TopicHeaderProps = {
  label: string;
  topInset: number;
  onBack: () => void;
};

function TopicHeader({ label, topInset, onBack }: TopicHeaderProps) {
  return (
    <View
      pointerEvents='box-none'
      style={{ paddingTop: topInset + 8 }}
      className='absolute left-0 right-0 top-0 flex-row items-center px-3'
    >
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole='button'
        accessibilityLabel='Kembali'
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        className='h-11 w-11 items-center justify-center'
      >
        <Ionicons name='chevron-back' size={28} color='#FAF6EE' />
      </Pressable>
      <Text
        numberOfLines={1}
        ellipsizeMode='tail'
        style={{ maxWidth: '70%' }}
        className='ml-1 font-sans text-base font-medium text-cream-lantern'
      >
        {label}
      </Text>
    </View>
  );
}

type EndCardProps = {
  topicLabel: string;
  height: number;
  topInset: number;
};

function EndCard({ topicLabel, height, topInset }: EndCardProps) {
  return (
    <View
      style={{ height, paddingTop: topInset + 64 }}
      className='items-center justify-center bg-charcoal-warung-deep px-8'
    >
      <Ionicons name='checkmark-circle-outline' size={44} color='#E89638' />
      <Text className='mt-6 text-center font-sans text-2xl font-bold text-cream-lantern'>
        Itu semua di {topicLabel} hari ini.
      </Text>
      <Text className='mt-2 text-center font-sans text-base text-bright-smoke'>
        Mau ke topik lain?
      </Text>
      <Pressable
        onPress={() => router.replace('/(tabs)/discover')}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        className='mt-8 h-12 items-center justify-center rounded-full bg-saffron-500 px-6'
      >
        <Text className='font-sans text-sm font-semibold text-charcoal-warung'>
          Lihat topik lain
        </Text>
      </Pressable>
    </View>
  );
}

type EmptyStateProps = {
  topicId: string | undefined;
  topicLabel: string | undefined;
  topInset: number;
  onBack: () => void;
};

function EmptyState({
  topicId,
  topicLabel,
  topInset,
  onBack,
}: EmptyStateProps) {
  const alts = otherCategories(topicId, 3);
  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />
      <View
        pointerEvents='box-none'
        style={{ paddingTop: topInset + 8 }}
        className='absolute left-0 right-0 top-0 z-10 flex-row items-center px-3'
      >
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole='button'
          accessibilityLabel='Kembali'
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className='h-11 w-11 items-center justify-center'
        >
          <Ionicons name='chevron-back' size={28} color='#FAF6EE' />
        </Pressable>
        {topicLabel && (
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{ maxWidth: '70%' }}
            className='ml-1 font-sans text-base font-medium text-cream-lantern'
          >
            {topicLabel}
          </Text>
        )}
      </View>

      <View className='flex-1 items-center justify-center px-8'>
        <Text className='text-center font-sans text-2xl font-bold text-cream-lantern'>
          Belum ada pelajaran di topik ini.
        </Text>
        <Text className='mt-2 text-center font-sans text-base text-bright-smoke'>
          Coba topik lain.
        </Text>
        <View className='mt-8 flex-row flex-wrap justify-center gap-3'>
          {alts.map((c) => (
            <Pressable
              key={c.id}
              onPress={() =>
                router.replace({
                  pathname: '/(screens)/(scroll)/[topicId]',
                  params: { topicId: c.id },
                })
              }
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
              className='rounded-full border border-saffron-500 px-4 py-2'
            >
              <Text className='font-sans text-sm font-medium text-saffron-500'>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
