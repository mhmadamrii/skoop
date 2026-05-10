import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name='[topicId]'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
