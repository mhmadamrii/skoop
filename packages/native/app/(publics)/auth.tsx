import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Auth() {
  const router = useRouter();
  const enter = () => router.replace('/(tabs)/feed');

  return (
    <View className='flex-1 bg-charcoal-warung'>
      <StatusBar style='light' />

      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View className='flex-1 justify-between px-8 py-4'>
          <View className='mt-12 items-center'>
            <View className='mb-6 h-16 w-16 items-center justify-center rounded-full bg-saffron-500'>
              <Ionicons name='flame' size={32} color='#14110D' />
            </View>
            <Text className='font-sans text-4xl font-bold text-cream-lantern'>
              Skoop
            </Text>
            <Text className='mt-2 font-sans text-base text-bright-smoke'>
              Belajar dalam 90 detik.
            </Text>
          </View>

          <View className='gap-3'>
            <Text className='mb-2 font-sans text-2xl font-bold text-cream-lantern'>
              Masuk untuk mulai.
            </Text>

            <AuthButton
              label='Lanjut dengan Apple'
              icon={<FontAwesome name='apple' size={22} color='#FAF6EE' />}
              onPress={enter}
            />
            <AuthButton
              label='Lanjut dengan Google'
              icon={<FontAwesome name='google' size={20} color='#FAF6EE' />}
              onPress={enter}
            />
            <AuthButton
              label='Lanjut dengan Email'
              icon={<Ionicons name='mail' size={22} color='#FAF6EE' />}
              onPress={enter}
            />

            <Pressable
              onPress={enter}
              hitSlop={12}
              className='items-center py-4'
            >
              <Text className='font-sans text-base font-semibold text-saffron-500'>
                Lanjutkan tanpa akun
              </Text>
            </Pressable>
          </View>

          <Text className='px-4 text-center font-sans text-xs text-dim-smoke'>
            Dengan lanjut, kamu setuju dengan{' '}
            <Text className='underline'>Syarat Layanan</Text> dan{' '}
            <Text className='underline'>Kebijakan Privasi</Text> Skoop.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

type AuthButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

function AuthButton({ label, icon, onPress }: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      className='h-14 flex-row items-center justify-center gap-3 rounded-2xl border border-dim-smoke px-6'
    >
      {icon}
      <Text className='font-sans text-base font-semibold text-cream-lantern'>
        {label}
      </Text>
    </Pressable>
  );
}
