import { useCallback, useState } from 'react';
import {
  FlatList,
  Platform,
  View,
  useWindowDimensions,
  type ListRenderItem,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FeedCell } from '@/components/feed-cell';
import { makeFeedBatch, type Lesson } from '@/lib/lessons';

export default function Feed() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { height: WIN_H } = useWindowDimensions();
  const cellHeight = Platform.OS === 'ios' ? WIN_H - tabBarHeight : WIN_H;

  const [data, setData] = useState<Lesson[]>(() => makeFeedBatch(0, 6));

  const loadMore = useCallback(() => {
    setData((prev) => [...prev, ...makeFeedBatch(prev.length, 4)]);
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
