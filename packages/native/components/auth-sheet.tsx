import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withUniwind } from 'uniwind';
import { authClient } from '@/lib/auth-client';
import { useToast } from 'heroui-native';
import { queryClient } from '@/utils/trpc';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

const StyledBottomSheetView = withUniwind(BottomSheetView);

type Mode = 'signin' | 'signup';

type AuthSheetSubmitPayload = {
  mode: Mode;
  email: string;
  password: string;
  name?: string;
};

type AuthSheetProps = {
  onSubmit?: (payload: AuthSheetSubmitPayload) => void;
  initialMode?: Mode;
};

export type AuthSheetRef = BottomSheetModal;

export const AuthSheet = forwardRef<BottomSheetModal, AuthSheetProps>(
  function AuthSheet({ onSubmit, initialMode = 'signin' }, ref) {
    const { toast } = useToast();
    const [mode, setMode] = useState<Mode>(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const snapPoints = useMemo(() => ['85%'], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.6}
          pressBehavior='close'
        />
      ),
      [],
    );

    const submit = async () => {
      setIsLoading(true);
      try {
        if (mode === 'signin') {
          await authClient.signIn.email(
            {
              email: email.trim(),
              password,
            },
            {
              onError(error) {
                toast.show({
                  variant: 'danger',
                  label: error.error?.message || 'Failed to sign in',
                });
              },
              onSuccess() {
                toast.show({
                  variant: 'success',
                  label: 'Signed in successfully',
                });
                queryClient.refetchQueries();
              },
            },
          );
        } else {
          await authClient.signUp.email(
            {
              email: email.trim(),
              password,
              name,
            },
            {
              onError(error) {
                console.log('error', JSON.stringify(error, null, 2));
                toast.show({
                  variant: 'danger',
                  label: error.error?.message || 'Failed to sign up',
                });
              },
              onSuccess() {
                toast.show({
                  variant: 'success',
                  label: 'Signed up successfully',
                });
                queryClient.refetchQueries();
              },
            },
          );
        }
      } catch (error: any) {
        toast.show({
          variant: 'danger',
          label: error?.error?.message || 'Something went wrong',
        });
      } finally {
        setIsLoading(false);
      }
    };

    const isSignin = mode === 'signin';

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: '#6e665a' }}
        backgroundStyle={{ backgroundColor: '#1c1813' }}
        keyboardBehavior='interactive'
        keyboardBlurBehavior='restore'
        android_keyboardInputMode='adjustResize'
      >
        <StyledBottomSheetView className='flex-1 px-6 pb-8 pt-2'>
          <View className='mb-6 flex-row gap-1 self-center rounded-full bg-charcoal-warung-deep p-1'>
            <ModeTab
              label='Masuk'
              active={isSignin}
              onPress={() => setMode('signin')}
            />
            <ModeTab
              label='Daftar'
              active={!isSignin}
              onPress={() => setMode('signup')}
            />
          </View>

          <Text className='font-sans text-2xl font-bold text-cream-lantern'>
            {isSignin ? 'Selamat datang kembali.' : 'Buat akun Skoop.'}
          </Text>
          <Text className='mb-6 mt-1 font-sans text-sm text-bright-smoke'>
            {isSignin
              ? 'Lanjutkan dari yang terakhir kamu pelajari.'
              : 'Mulai belajar 90 detik sehari.'}
          </Text>

          <View className='gap-3'>
            {!isSignin && (
              <Field
                icon='person-outline'
                placeholder='Nama'
                value={name}
                onChangeText={setName}
                autoCapitalize='words'
                returnKeyType='next'
              />
            )}
            <Field
              icon='mail-outline'
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='next'
            />
            <Field
              icon='lock-closed-outline'
              placeholder='Kata sandi'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize='none'
              returnKeyType='done'
              onSubmitEditing={submit}
            />
          </View>

          <Pressable
            disabled={isLoading}
            onPress={submit}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className='mt-6 h-14 items-center justify-center rounded-2xl bg-saffron-500'
          >
            <Text className='font-sans text-base font-semibold text-charcoal-warung'>
              {isSignin ? 'Masuk' : 'Daftar'}
            </Text>
          </Pressable>

          {isSignin ? (
            <Pressable hitSlop={12} className='mt-4 items-center py-2'>
              <Text className='font-sans text-sm font-medium text-saffron-500'>
                Lupa kata sandi?
              </Text>
            </Pressable>
          ) : (
            <Text className='mt-4 px-4 text-center font-sans text-xs text-dim-smoke'>
              Dengan daftar, kamu setuju dengan{' '}
              <Text className='underline'>Syarat Layanan</Text> dan{' '}
              <Text className='underline'>Kebijakan Privasi</Text> Skoop.
            </Text>
          )}
        </StyledBottomSheetView>
      </BottomSheetModal>
    );
  },
);

function ModeTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className={`rounded-full px-5 py-2 ${active ? 'bg-saffron-500' : ''}`}
    >
      <Text
        className={`font-sans text-sm font-semibold ${
          active ? 'text-charcoal-warung' : 'text-bright-smoke'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type FieldProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
} & TextInputProps;

function Field({ icon, ...inputProps }: FieldProps) {
  return (
    <View className='h-14 flex-row items-center gap-3 rounded-2xl border border-dim-smoke px-4'>
      <Ionicons name={icon} size={20} color='#b8ae9d' />
      <BottomSheetTextInput
        {...inputProps}
        placeholderTextColor='#6e665a'
        style={{
          flex: 1,
          color: '#faf6ee',
          fontSize: 16,
          fontFamily: 'Geist',
        }}
      />
    </View>
  );
}
