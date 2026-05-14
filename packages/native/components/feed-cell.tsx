import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { findCategory } from '@/lib/categories';
import { formatCount, VIDEO_BG, type Lesson } from '@/lib/lessons';

const AVATAR = require('../assets/images/placeholder.png');

type FeedCellProps = {
  lesson: Lesson;
  height: number;
  topInset: number;
  isActive?: boolean;
  showCategoryLabel?: boolean;
};

export function FeedCell({
  lesson,
  height,
  topInset,
  isActive = true,
  showCategoryLabel = true,
}: FeedCellProps) {
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

  const player = useVideoPlayer(lesson.videoUrl ?? null, (p) => {
    p.loop = true;
    p.muted = false;
  });

  if (isActive && lesson.videoUrl) {
    player.play();
  } else {
    player.pause();
  }

  const category =
    findCategory(lesson.category.slug) ??
    (lesson.category.name
      ? {
          id: lesson.category.slug,
          label: lesson.category.name,
          icon: 'pricetag' as const,
        }
      : null);

  const creatorLabel = lesson.creator.handle.startsWith('@')
    ? lesson.creator.handle
    : `@${lesson.creator.handle}`;

  return (
    <View style={{ height }} className='bg-charcoal-warung'>
      {lesson.videoUrl ? (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit='cover'
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      ) : (
        <Image
          source={
            lesson.thumbUrl
              ? { uri: lesson.thumbUrl }
              : VIDEO_BG[lesson.bgIndex]
          }
          style={StyleSheet.absoluteFill}
          contentFit='cover'
          transition={200}
        />
      )}

      {lesson.videoUrl && lesson.thumbUrl && (
        <Image
          source={{ uri: lesson.thumbUrl }}
          style={[StyleSheet.absoluteFill, { opacity: isActive ? 0 : 1 }]}
          contentFit='cover'
          transition={200}
          pointerEvents='none'
        />
      )}

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

      {showCategoryLabel && category && (
        <View
          style={{ paddingTop: topInset + 14 }}
          className='absolute left-0 right-0 top-0 px-5'
        >
          <Text className='font-sans text-xs font-medium tracking-widest text-cream-lantern'>
            {category.label.toUpperCase()}
          </Text>
        </View>
      )}

      <View className='absolute bottom-6 left-5 right-20'>
        <View className='mb-3 flex-row items-center gap-2'>
          <Image
            source={
              lesson.creator.avatarUrl
                ? { uri: lesson.creator.avatarUrl }
                : AVATAR
            }
            style={{ width: 32, height: 32, borderRadius: 16 }}
            contentFit='cover'
          />
          <Text className='font-sans text-base font-semibold text-cream-lantern'>
            {creatorLabel}
          </Text>
        </View>
        <Text className='font-sans text-2xl font-bold leading-tight text-cream-lantern'>
          {lesson.title}
        </Text>
        {!!lesson.description && (
          <Text className='mt-2 font-sans text-sm leading-relaxed text-cream-lantern'>
            {lesson.description}
          </Text>
        )}
      </View>

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
            {formatCount(lesson.counts.likes)}
          </Text>
        </Pressable>

        <Pressable hitSlop={8} className='items-center'>
          <Ionicons name='chatbubble-outline' size={28} color='#FAF6EE' />
          <Text className='mt-1 font-sans text-xs font-medium text-cream-lantern'>
            {formatCount(lesson.counts.comments)}
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
            {formatCount(lesson.counts.saves)}
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
