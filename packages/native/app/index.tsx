import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Index() {
  return (
    <View className='border border-red-500 pt-20'>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        title='Go to details'
        onPress={() => router.push('/onboarding')}
      />
    </View>
  );
}
