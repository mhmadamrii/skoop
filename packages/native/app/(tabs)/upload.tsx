import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

import { useCallback, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { withUniwind } from 'uniwind';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'heroui-native';
import { trpc } from '@/utils/trpc';
import { CATEGORIES, type CategoryId } from '@/lib/categories';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const StyledSafeAreaView = withUniwind(SafeAreaView);

const STEP_LABELS = ['Pilih', 'Detail', 'Publikasi'] as const;
type Step = 0 | 1 | 2;

const MAX_DURATION_MS = 90_000;
const FRAME_COUNT = 8;
const MAX_TITLE = 80;
const MAX_DESC = 280;

const COLORS = {
  saffron: '#e89638',
  charcoal: '#14110d',
  charcoalRaised: '#1c1813',
  charcoalDeep: '#0e0b08',
  cream: '#faf6ee',
  dim: '#6e665a',
  bright: '#b8ae9d',
};

type Pick = {
  uri: string;
  mimeType: string;
  duration?: number;
  width?: number;
  height?: number;
};

export default function Upload() {
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(0);
  const [pick, setPick] = useState<Pick | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [framesLoading, setFramesLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 16);
  const abortRef = useRef<AbortController | null>(null);

  const queryClient = useQueryClient();
  const createUploadUrlMutation = useMutation(
    trpc.storage.createUploadUrl.mutationOptions(),
  );
  const createLessonMutation = useMutation(
    trpc.lesson.create.mutationOptions(),
  );

  const resetAll = useCallback(() => {
    setStep(0);
    setPick(null);
    setFrames([]);
    setCoverUri(null);
    setTitle('');
    setDescription('');
    setCategoryId(null);
    setTitleError(false);
    setUploadPct(0);
  }, []);

  const pickVideo = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toast.show({
        variant: 'danger',
        label: 'Skoop perlu akses galeri untuk mengunggah pelajaran.',
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: false,
      videoMaxDuration: 90,
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    if (asset.duration && asset.duration > MAX_DURATION_MS) {
      toast.show({
        variant: 'danger',
        label: 'Video lebih dari 90 detik. Pangkas dulu di galeri kamu.',
      });
      return;
    }
    setPick({
      uri: asset.uri,
      mimeType: asset.mimeType ?? 'video/mp4',
      duration: asset.duration ?? undefined,
      width: asset.width,
      height: asset.height,
    });
    setStep(1);
    setFramesLoading(true);
    const totalMs = asset.duration ?? 30_000;
    const stops = Array.from({ length: FRAME_COUNT }, (_, i) =>
      Math.floor((i / FRAME_COUNT) * totalMs),
    );
    try {
      const generated = await Promise.all(
        stops.map(async (time) => {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
              time,
              quality: 0.7,
            });
            return uri;
          } catch {
            return '';
          }
        }),
      );
      const ok = generated.filter(Boolean);
      setFrames(ok);
      if (ok[0]) setCoverUri(ok[0]);
    } finally {
      setFramesLoading(false);
    }
  }, [toast]);

  const canProceedDetail = !!title.trim() && !!categoryId;

  const handleContinueDetail = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    if (!categoryId) {
      toast.show({
        variant: 'warning',
        label: 'Pilih satu kategori dulu.',
      });
      return;
    }
    setStep(2);
  };

  const handlePublish = async () => {
    if (!pick || !coverUri || !categoryId) return;
    setUploading(true);
    setUploadPct(5);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const videoResp = await fetch(pick.uri);
      const videoBlob = await videoResp.blob();
      const videoExt = (pick.mimeType.split('/')[1] ?? 'mp4').slice(0, 8);
      setUploadPct(15);

      const videoSign = await createUploadUrlMutation.mutateAsync({
        prefix: 'lessons',
        contentType: pick.mimeType,
        contentLength: videoBlob.size,
        ext: videoExt,
      });
      console.log('videoSign', JSON.stringify(videoSign, null, 2));
      setUploadPct(25);

      await fetch(videoSign.url, {
        method: 'PUT',
        body: videoBlob,
        headers: { 'Content-Type': pick.mimeType },
        signal: controller.signal,
      });
      setUploadPct(70);

      const coverResp = await fetch(coverUri);
      const coverBlob = await coverResp.blob();
      const coverSign = await createUploadUrlMutation.mutateAsync({
        prefix: 'thumbnails',
        contentType: 'image/jpeg',
        contentLength: coverBlob.size,
        ext: 'jpg',
      });
      setUploadPct(85);

      await fetch(coverSign.url, {
        method: 'PUT',
        body: coverBlob,
        headers: { 'Content-Type': 'image/jpeg' },
        signal: controller.signal,
      });
      setUploadPct(92);

      await createLessonMutation.mutateAsync({
        videoKey: videoSign.key,
        coverKey: coverSign.key,
        title: title.trim(),
        description: description.trim(),
        categorySlug: categoryId,
        duration: Math.max(1, Math.round(pick.duration ?? 0)),
      });
      setUploadPct(100);

      await queryClient.invalidateQueries({
        queryKey: trpc.lesson.feed.infiniteQueryKey(),
      });

      toast.show({
        variant: 'success',
        label: 'Pelajaran kamu sudah live.',
      });
      resetAll();
      router.push('/(tabs)/feed');
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        toast.show({
          variant: 'warning',
          label: 'Unggahan dibatalkan.',
        });
      } else {
        console.warn('[upload] failed', err);
        toast.show({
          variant: 'danger',
          label: 'Gagal mengunggah. Coba lagi.',
        });
      }
    } finally {
      setUploading(false);
      setUploadPct(0);
      abortRef.current = null;
    }
  };

  const cancelUpload = () => abortRef.current?.abort();

  const goBack = () => {
    if (uploading) return;
    if (step === 0) return;
    setStep((step - 1) as Step);
  };

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />
      <StyledSafeAreaView edges={['top']} className='flex-1'>
        <Header step={step} onBack={goBack} onClose={resetAll} />
        <Stepper step={step} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
          <ScrollView
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{ paddingBottom: 160 }}
            showsVerticalScrollIndicator={false}
          >
            {step === 0 && <StepPick onPick={pickVideo} />}
            {step === 1 && pick && (
              <StepDetail
                pick={pick}
                frames={frames}
                framesLoading={framesLoading}
                coverUri={coverUri}
                onCoverSelect={setCoverUri}
                title={title}
                onTitleChange={(v) => {
                  setTitle(v);
                  if (titleError) setTitleError(false);
                }}
                titleError={titleError}
                description={description}
                onDescriptionChange={setDescription}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
              />
            )}
            {step === 2 && (
              <StepPublish
                coverUri={coverUri}
                title={title}
                description={description}
                categoryId={categoryId}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <BottomBar
          step={step}
          pickReady={!!pick}
          detailReady={canProceedDetail}
          onNextFromPick={() => setStep(1)}
          onNextFromDetail={handleContinueDetail}
          onPublish={handlePublish}
          disabled={uploading}
          bottomInset={bottomInset}
        />

        {uploading && <UploadOverlay pct={uploadPct} onCancel={cancelUpload} />}
      </StyledSafeAreaView>
    </View>
  );
}

function Header({
  step,
  onBack,
  onClose,
}: {
  step: Step;
  onBack: () => void;
  onClose: () => void;
}) {
  const showBack = step > 0;
  return (
    <View className='h-12 flex-row items-center justify-between px-4'>
      <View className='w-10'>
        {showBack && (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            className='h-10 w-10 items-center justify-center'
          >
            <Ionicons name='chevron-back' size={26} color={COLORS.cream} />
          </Pressable>
        )}
      </View>
      <Text className='font-sans text-base font-semibold text-cream-lantern'>
        Unggah pelajaran
      </Text>
      <View className='w-10 items-end'>
        {step > 0 && (
          <Pressable
            onPress={onClose}
            hitSlop={12}
            className='h-10 w-10 items-center justify-center'
          >
            <Ionicons name='close' size={24} color={COLORS.bright} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Stepper({ step }: { step: Step }) {
  return (
    <View className='px-6 pt-2 pb-5'>
      <View className='flex-row gap-2'>
        {STEP_LABELS.map((_, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <View
              key={i}
              className='h-1 flex-1 rounded-full'
              style={{
                backgroundColor:
                  done || active ? COLORS.saffron : COLORS.charcoalDeep,
              }}
            />
          );
        })}
      </View>
      <View className='mt-3 flex-row justify-between'>
        {STEP_LABELS.map((label, i) => {
          const active = i === step;
          return (
            <Text
              key={label}
              className='font-sans text-xs tracking-wider'
              style={{
                color: active ? COLORS.saffron : COLORS.dim,
                fontWeight: active ? '600' : '500',
              }}
            >
              {`${i + 1}. ${label}`}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

function StepPick({ onPick }: { onPick: () => void }) {
  return (
    <View className='flex-1 px-6 pt-12'>
      <View className='items-center'>
        <View className='mb-6 h-16 w-16 items-center justify-center rounded-full bg-saffron-500/15'>
          <Ionicons name='videocam' size={28} color={COLORS.saffron} />
        </View>
        <Text className='text-center font-sans text-2xl font-bold leading-tight text-cream-lantern'>
          Bagikan sesuatu yang kamu tahu.
        </Text>
        <Text className='mt-3 max-w-[280px] text-center font-sans text-sm leading-relaxed text-bright-smoke'>
          Satu pelajaran, di bawah 90 detik. Mulai dari yang kamu paling suka
          ceritakan.
        </Text>
      </View>

      <Pressable
        onPress={onPick}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        className='mt-10 h-16 flex-row items-center justify-center gap-3 rounded-2xl bg-saffron-500'
      >
        <Ionicons name='images' size={20} color={COLORS.charcoal} />
        <Text className='font-sans text-base font-semibold text-charcoal-warung'>
          Pilih dari galeri
        </Text>
      </Pressable>

      <View className='mt-4 h-16 flex-row items-center justify-center gap-3 rounded-2xl border border-dim-smoke/40 bg-charcoal-warung-raised opacity-60'>
        <Ionicons name='radio-button-on' size={18} color={COLORS.bright} />
        <Text className='font-sans text-sm font-medium text-bright-smoke'>
          Rekam langsung
        </Text>
        <Text className='font-sans text-xs text-dim-smoke'>· segera</Text>
      </View>

      <View className='mt-10 flex-row items-center gap-2 self-center'>
        <Ionicons
          name='shield-checkmark-outline'
          size={14}
          color={COLORS.dim}
        />
        <Text className='font-sans text-xs text-dim-smoke'>
          Skoop hanya menerima konten edukatif.
        </Text>
      </View>
    </View>
  );
}

function StepDetail({
  pick,
  frames,
  framesLoading,
  coverUri,
  onCoverSelect,
  title,
  onTitleChange,
  titleError,
  description,
  onDescriptionChange,
  categoryId,
  onCategoryChange,
}: {
  pick: Pick;
  frames: string[];
  framesLoading: boolean;
  coverUri: string | null;
  onCoverSelect: (uri: string) => void;
  title: string;
  onTitleChange: (v: string) => void;
  titleError: boolean;
  description: string;
  onDescriptionChange: (v: string) => void;
  categoryId: CategoryId | null;
  onCategoryChange: (id: CategoryId) => void;
}) {
  const durationLabel = useMemo(() => {
    if (!pick.duration) return null;
    const total = Math.round(pick.duration / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`;
  }, [pick.duration]);

  return (
    <View className='px-6'>
      <View className='flex-row gap-4'>
        <View
          className='overflow-hidden rounded-2xl bg-charcoal-warung-deep'
          style={{ width: 100, height: 140 }}
        >
          {coverUri ? (
            <Image
              source={{ uri: coverUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit='cover'
            />
          ) : (
            <View className='h-full w-full items-center justify-center'>
              <Ionicons name='film-outline' size={22} color={COLORS.dim} />
            </View>
          )}
        </View>
        <View className='flex-1 justify-center gap-2'>
          <Text className='font-sans text-xs font-medium tracking-wider text-dim-smoke'>
            PRATINJAU
          </Text>
          <Text className='font-sans text-base font-semibold text-cream-lantern'>
            {title.trim() || 'Pelajaran tanpa judul'}
          </Text>
          {durationLabel && (
            <View className='flex-row items-center gap-1.5'>
              <Ionicons name='time-outline' size={13} color={COLORS.bright} />
              <Text className='font-sans text-xs text-bright-smoke'>
                {durationLabel}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className='mt-7'>
        <View className='mb-3 flex-row items-center justify-between'>
          <Text className='font-sans text-sm font-semibold text-cream-lantern'>
            Pilih sampul
          </Text>
          <Text className='font-sans text-xs text-dim-smoke'>
            {frames.length > 0 ? `${frames.length} frame` : ''}
          </Text>
        </View>
        {framesLoading ? (
          <View className='h-20 items-center justify-center rounded-2xl bg-charcoal-warung-raised'>
            <ActivityIndicator color={COLORS.saffron} />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {frames.map((uri) => {
              const active = uri === coverUri;
              return (
                <Pressable
                  key={uri}
                  onPress={() => onCoverSelect(uri)}
                  className='overflow-hidden rounded-xl'
                  style={({ pressed }) => ({
                    width: 56,
                    height: 80,
                    opacity: pressed ? 0.8 : 1,
                    borderWidth: active ? 2 : 1,
                    borderColor: active ? COLORS.saffron : COLORS.charcoalDeep,
                  })}
                >
                  <Image
                    source={{ uri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit='cover'
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      <View className='mt-8'>
        <Text className='mb-2 font-sans text-sm font-semibold text-cream-lantern'>
          Judul
        </Text>
        <View
          className='rounded-2xl border bg-charcoal-warung-raised px-4 py-3'
          style={{
            borderColor: titleError ? '#d4822a' : COLORS.charcoalDeep,
          }}
        >
          <TextInput
            value={title}
            onChangeText={onTitleChange}
            placeholder='mis. Kenapa kopi gayo punya rasa khas?'
            placeholderTextColor={COLORS.dim}
            maxLength={MAX_TITLE}
            style={{
              color: COLORS.cream,
              fontSize: 16,
              fontFamily: 'Geist',
              padding: 0,
            }}
          />
        </View>
        <View className='mt-1.5 flex-row justify-between'>
          <Text className='font-sans text-xs text-saffron-500'>
            {titleError ? 'Judul harus diisi.' : ' '}
          </Text>
          <Text className='font-sans text-xs text-dim-smoke'>
            {title.length}/{MAX_TITLE}
          </Text>
        </View>
      </View>

      <View className='mt-2'>
        <Text className='mb-2 font-sans text-sm font-semibold text-cream-lantern'>
          Konteks <Text className='text-dim-smoke'>(opsional)</Text>
        </Text>
        <View className='rounded-2xl border border-charcoal-warung-deep bg-charcoal-warung-raised px-4 py-3'>
          <TextInput
            value={description}
            onChangeText={onDescriptionChange}
            placeholder='Apa yang bisa orang bawa pulang dari pelajaran ini?'
            placeholderTextColor={COLORS.dim}
            multiline
            maxLength={MAX_DESC}
            style={{
              color: COLORS.cream,
              fontSize: 15,
              fontFamily: 'Geist',
              lineHeight: 22,
              padding: 0,
              minHeight: 72,
              textAlignVertical: 'top',
            }}
          />
        </View>
        <View className='mt-1.5 items-end'>
          <Text className='font-sans text-xs text-dim-smoke'>
            {description.length}/{MAX_DESC}
          </Text>
        </View>
      </View>

      <View className='mt-4'>
        <Text className='mb-3 font-sans text-sm font-semibold text-cream-lantern'>
          Kategori
        </Text>
        <View className='flex-row flex-wrap gap-2'>
          {CATEGORIES.map((cat) => {
            const active = cat.id === categoryId;
            return (
              <Pressable
                key={cat.id}
                onPress={() => onCategoryChange(cat.id)}
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                className={
                  'flex-row items-center gap-2 rounded-full border px-4 py-2.5 ' +
                  (active
                    ? 'border-saffron-500 bg-saffron-500'
                    : 'border-charcoal-warung-deep bg-charcoal-warung-raised')
                }
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={active ? COLORS.charcoal : COLORS.bright}
                />
                <Text
                  className='font-sans text-sm font-medium'
                  style={{
                    color: active ? COLORS.charcoal : COLORS.cream,
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className='mt-7 flex-row items-start gap-2 rounded-2xl border border-charcoal-warung-deep bg-charcoal-warung-raised px-4 py-3'>
        <Ionicons
          name='sparkles-outline'
          size={16}
          color={COLORS.saffron}
          style={{ marginTop: 2 }}
        />
        <Text className='flex-1 font-sans text-xs leading-relaxed text-bright-smoke'>
          Caption otomatis akan dibuat saat publikasi. Kamu bisa mengeditnya
          nanti.
        </Text>
      </View>
    </View>
  );
}

function StepPublish({
  coverUri,
  title,
  description,
  categoryId,
}: {
  coverUri: string | null;
  title: string;
  description: string;
  categoryId: CategoryId | null;
}) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return (
    <View className='px-6'>
      <Text className='font-sans text-2xl font-bold leading-tight text-cream-lantern'>
        Siap dibagikan.
      </Text>
      <Text className='mt-2 font-sans text-sm text-bright-smoke'>
        Cek sekali lagi sebelum pelajaran kamu masuk ke feed.
      </Text>

      <View className='mt-7 flex-row gap-4 rounded-2xl bg-charcoal-warung-raised p-4'>
        <View
          className='overflow-hidden rounded-xl bg-charcoal-warung-deep'
          style={{ width: 96, height: 132 }}
        >
          {coverUri && (
            <Image
              source={{ uri: coverUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit='cover'
            />
          )}
        </View>
        <View className='flex-1 gap-2'>
          <Text
            className='font-sans text-base font-semibold leading-snug text-cream-lantern'
            numberOfLines={3}
          >
            {title.trim()}
          </Text>
          {category && (
            <View className='flex-row items-center gap-1.5 self-start rounded-full bg-saffron-500/15 px-2.5 py-1'>
              <Ionicons name={category.icon} size={12} color={COLORS.saffron} />
              <Text className='font-sans text-xs font-medium text-saffron-500'>
                {category.label}
              </Text>
            </View>
          )}
          {!!description.trim() && (
            <Text
              className='font-sans text-xs leading-relaxed text-bright-smoke'
              numberOfLines={3}
            >
              {description.trim()}
            </Text>
          )}
        </View>
      </View>

      <View className='mt-5 flex-row items-start gap-2 rounded-2xl border border-charcoal-warung-deep bg-charcoal-warung-raised px-4 py-3'>
        <Ionicons
          name='sparkles-outline'
          size={16}
          color={COLORS.saffron}
          style={{ marginTop: 2 }}
        />
        <Text className='flex-1 font-sans text-xs leading-relaxed text-bright-smoke'>
          Caption otomatis akan dibuat saat publikasi.
        </Text>
      </View>

      <View className='mt-5 flex-row items-start gap-2 px-1'>
        <Ionicons
          name='shield-checkmark-outline'
          size={14}
          color={COLORS.dim}
          style={{ marginTop: 2 }}
        />
        <Text className='flex-1 font-sans text-xs leading-relaxed text-dim-smoke'>
          Dengan publikasi, kamu menyatakan konten ini edukatif dan sesuai
          pedoman komunitas Skoop.
        </Text>
      </View>
    </View>
  );
}

function BottomBar({
  step,
  pickReady,
  detailReady,
  onNextFromPick,
  onNextFromDetail,
  onPublish,
  disabled,
  bottomInset,
}: {
  step: Step;
  pickReady: boolean;
  detailReady: boolean;
  onNextFromPick: () => void;
  onNextFromDetail: () => void;
  onPublish: () => void;
  disabled: boolean;
  bottomInset: number;
}) {
  if (step === 0 && !pickReady) return null;

  const primaryLabel = step === 2 ? 'Publikasikan pelajaran' : 'Lanjut';
  const onPress =
    step === 0 ? onNextFromPick : step === 1 ? onNextFromDetail : onPublish;
  const enabled = step === 0 ? pickReady : step === 1 ? detailReady : true;
  const isDisabled = disabled || !enabled;

  return (
    <View
      className='absolute bottom-0 left-0 right-0 border-t border-charcoal-warung-deep bg-charcoal-warung px-6 pt-3'
      style={{ paddingBottom: bottomInset }}
    >
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => ({
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        })}
        className='h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-saffron-500'
      >
        <Text className='font-sans text-base font-semibold text-charcoal-warung'>
          {primaryLabel}
        </Text>
        {step !== 2 && (
          <Ionicons name='arrow-forward' size={18} color={COLORS.charcoal} />
        )}
      </Pressable>
      {step === 2 && (
        <Pressable
          hitSlop={8}
          disabled={disabled}
          className='mt-2 items-center py-2'
        >
          <Text className='font-sans text-sm font-medium text-bright-smoke'>
            Simpan sebagai draf
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function UploadOverlay({
  pct,
  onCancel,
}: {
  pct: number;
  onCancel: () => void;
}) {
  return (
    <View className='absolute inset-0 items-center justify-center bg-charcoal-warung/95 px-8'>
      <View className='h-20 w-20 items-center justify-center rounded-full bg-saffron-500/15'>
        <ActivityIndicator color={COLORS.saffron} size='large' />
      </View>
      <Text className='mt-6 font-sans text-base font-semibold text-cream-lantern'>
        Mengunggah pelajaran kamu…
      </Text>
      <Text className='mt-2 font-sans text-sm text-bright-smoke'>
        Jangan tutup Skoop dulu.
      </Text>

      <View className='mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-charcoal-warung-deep'>
        <View
          className='h-full rounded-full bg-saffron-500'
          style={{ width: `${Math.max(5, Math.min(100, pct))}%` }}
        />
      </View>
      <Text className='mt-3 font-sans text-xs text-dim-smoke'>{pct}%</Text>

      <Pressable onPress={onCancel} hitSlop={12} className='mt-8 py-2'>
        <Text className='font-sans text-sm font-medium text-bright-smoke underline'>
          Batalkan unggahan
        </Text>
      </Pressable>
    </View>
  );
}
